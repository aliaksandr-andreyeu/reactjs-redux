import React, { Component } from 'react'
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Linking
} from 'react-native'
import propTypes from 'prop-types'
import styles from './styles'
import SsaEventDetails from './components/SsaEventDetails'
import SsaEventInvitee from './components/SsaEventInvitee'
import colors from '../../constants/colors'
import ExpandableText from '../../components/Details/ExpandableText'
import ActionButton from '../../components/Details/ActionButton'
import Banner from '../../components/Details/Banner'
import DataBox from '../../components/Details/DataBox'
import DetailsWrapper from '../../components/Details/DetailsWrapper'
import { axiosInstance, apiUrls, externalLinks } from '../../constants/api'
import { ssaEventActivityType, ssaEventPayment } from '../../constants/socialSportsActivity'
import Loading from '../../components/Loading'
import i18n from '../../../i18n'

import Global from '../../components/global'
import { NavHeaderUser } from '../../components/NavHeaderUser'
import Moment from 'moment'
import decodeHtmlEntities from '../../helpers/decodeHtmlEntities'
import extractTweets from '../../helpers/extractTweets'
import FullWidthImage from 'react-native-fullwidth-image'
import SectionTitle from '../../components/Details/SectionTitle'
import { fontFamily, fontSize } from '../../constants/fonts'
import HTML from 'react-native-render-html'
import Tweet from '../../components/Tweet'
import { htmlStyles } from '../../constants/htmlRendering'
import YouTube from '../../components/YouTube'
import ScrollListContainer from '../../components/ScrollListContainer'
import ScrollListItem from '../../components/ScrollListItem'
import GeneralAdmission from '../EventsDetailScreen/components/GeneralAdmission'
import Ads from '../../components/UI/Ads'
import IconCreator from '../../components/Icon'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import fontelloConfig from '../../assets/fonts/customicons-config'

import Icon from '../../components/Icon'
import { getSsaPlayerLevel } from '../../helpers/socialSportsActivity'
import NewButton from '../../components/UI/NewButtonComponent'

import shareData from '../../helpers/shareData'

const Icon2 = createIconSetFromFontello(fontelloConfig)

class SsaDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('socialSportsActivity.match_details')
    }
  }

  state = {
    isLoading: true,
    event: null,
    participants: [],
    // isParticipating: false,
    ads: [],
    isBookmarked: false
  }

  getSsaEvent(cb) {
    const { navigation } = this.props

    const navigatorParams = navigation.getParam('params')

    // console.log('!!!!!!!!!!!!!!!!!!!! navigatorParams', navigatorParams);

    const id = navigatorParams.id ? navigatorParams.id : false
    // const id = 1179;

    console.log('id', id, typeof id)
    console.log('Global.isBookmarked ssaEvent', Global.isBookmarked(id, 'ssaEvent'))
    // console.log('Global.user', Global.user);
    // console.log('Boolean(Global.user.token) && Boolean(Global.user.token.length > 5)', (Boolean(Global.user.token) && Boolean(Global.user.token.length > 5)));

    if (id !== undefined) {
      this.setState(
        {
          isBookmarked: Global.isBookmarked(id, 'ssaEvent')
        },
        () => {
          let requests = [
            axiosInstance(apiUrls.getSsaEventById(id)),
            axiosInstance(apiUrls.getAds(4, 0, 0) + '?langCode=' + i18n.locale.toUpperCase())
          ]

          if (Boolean(Global.user.token) && Boolean(Global.user.token.length > 5)) {
            requests.push(axiosInstance(apiUrls.getEventParticipants(id)))
            requests.push(axiosInstance(apiUrls.getMyActivities))
          }

          Promise.all(requests)
            .then(([event, ads, participants, myActivities]) => {
              // console.log('event.data', event.data);
              // console.log('********************************');

              if (Boolean(Global.user.token) && Boolean(Global.user.token.length > 5)) {
                this.setState(
                  {
                    event: event.data,
                    ads: ads.data,
                    participants: participants.data,
                    // isParticipating: myActivities.data.Items.includes(
                    // item => item.Id === id
                    // ),
                    isLoading: false
                  },
                  () => {
                    Boolean(cb) && cb()
                  }
                )

                // console.log('!!!!!!!!!!!!!!!!!!!! myActivities.data.Items', myActivities.data.Items);
                // console.log(
                // '!!!!!!!!!!!!!!!!!!!!',
                // myActivities.data.Items.includes(item => item.Id === id)
                // );

                //console.log('event.data', event.data);
                // console.log('********************************');
                // console.log('participants.data', participants.data);
                // console.log('********************************');
                // console.log('myActivities.data', myActivities.data);
                // console.log('********************************');
              } else {
                this.setState(
                  {
                    event: event.data,
                    participants: [],
                    // isParticipating: false,
                    isLoading: false
                  },
                  () => {
                    Boolean(cb) && cb()
                  }
                )
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      )
    }
  }

  componentDidMount() {
    this.getSsaEvent()
  }

  updateParticipantsList = () => {
    const { navigation } = this.props
    const navigatorParams = navigation.getParam('params')

    axiosInstance(apiUrls.getEventParticipants(navigatorParams.id)).then(({ data }) => {
      this.setState({
        participants: data
      })
    })
  }

  inviteParticipants = () => {
    const { navigation } = this.props
    const { event } = this.state

    if (event.Id) {
      navigation.navigate('SsaInvitationScreen', { id: event.Id })
    }
  }

  requestParticipation = () => {
    const { navigation } = this.props
    const navigatorParams = navigation.getParam('params', {})

    if (navigatorParams.id) {
      axiosInstance.post(apiUrls.postRequestJoin(navigatorParams.id)).then(() => {
        this.getSsaEvent(() => {
          navigation.navigate('Cart')
        })

        // this.setState(
        // {
        // isParticipating: true,
        // },
        // () => {
        // this.getSsaEvent();
        // }
        // );
      })
    }
  }

  toggleBookmark = () => {
    const { navigation } = this.props
    const { isBookmarked } = this.state

    const navigatorParams = navigation.getParam('params', {})

    if (navigatorParams.id) {
      const params = {
        Id: navigatorParams.id,
        Entity: 'ssaEvent'
      }

      console.log(params)

      if (isBookmarked) {
        axiosInstance.post(apiUrls.postRemoveBookmark, params).then(() => {
          Global.loadFavorites()

          this.setState(() => ({
            isBookmarked: false
          }))

          Boolean(navigation.state.params.getBookmarks()) && navigation.state.params.getBookmarks()
        })
      } else {
        axiosInstance.post(apiUrls.postAddBookmark, params).then(data => {
          Global.loadFavorites()

          this.setState(() => ({
            isBookmarked: true
          }))

          Boolean(navigation.state.params.getBookmarks()) && navigation.state.params.getBookmarks()
        })
      }
    }
  }

  renderButton() {
    const { event, participants } = this.state
    const {
      navigation: { getParam }
    } = this.props

    const navigatorParams = getParam('params', {})

    const noPlace = Boolean(
      participants.filter(item => item.Participant !== null).length === event.NumberOfParticipants
    )

    let messageToShare = ''

    if (navigatorParams.id) {
      messageToShare = externalLinks.getMatchesUrl(navigatorParams.id)
    }

    if (event.IsCurrentUserHost) {
      if (!noPlace) {
        return (
          <NewButton
            buttonStyles={{
              backgroundColor: '#202873',
              marginTop: 10
            }}
            position={'single'}
            //onPress={this.inviteParticipants}
            onPress={() => this.goShareData(messageToShare)}
            label={i18n.t('socialSportsActivity.invite_friend')}
          />
        )
      }
    } else {
      if (event.IsJoinRequestSent) {
        return (
          <NewButton
            buttonStyles={{ backgroundColor: '#202873', marginTop: 10 }}
            position={'single'}
            disabled={true}
            onPress={() => false}
            label={i18n.t('socialSportsActivity.participation_pending')}
          />
        )
      } else if (event.IsJoinRequestApproved) {
        return (
          <NewButton
            buttonStyles={{ backgroundColor: '#78bc4b', marginTop: 10 }}
            position={'single'}
            disabled={true}
            onPress={() => false}
            label={i18n.t('socialSportsActivity.join_approved')}
          />
        )
      } else if (event.IsJoinRequestRejected) {
        return (
          <NewButton
            buttonStyles={{ backgroundColor: '#f14b54', marginTop: 10 }}
            position={'single'}
            disabled={true}
            onPress={() => false}
            label={i18n.t('socialSportsActivity.join_rejected')}
          />
        )
      } else if (!noPlace) {
        return (
          <NewButton
            buttonStyles={{ backgroundColor: '#78BC4B', marginTop: 10 }}
            position={'single'}
            onPress={this.requestParticipation}
            label={i18n.t('socialSportsActivity.request_join')}
          />
        )
      }
    }

    return null
  }

  goShareData(messageToShare) {
    if (!messageToShare) return false
    shareData(messageToShare)
  }

  render() {
    const {
      navigation: { getParam }
    } = this.props

    // const { ads, webViewHeight, isLoading, event, participants, isParticipating } = this.state;
    const { ads, webViewHeight, isLoading, event, participants } = this.state

    const navigatorParams = getParam('params', {})

    Moment.locale('en')

    if (isLoading) {
      return <Loading />
    }

    const {
      getIcon,
      iconLibraries: { fontAwesome, materialIcons, fontAwesome5 }
    } = Icon

    const groupIcon = getIcon(materialIcons, 'group', {
      size: 14,
      color: '#575756'
    })

    const groupIconLarge = getIcon(materialIcons, 'group', {
      size: 18,
      color: '#4F4F4F'
    })

    const exclamationIcon = getIcon(fontAwesome, 'exclamation', {
      size: 14,
      color: '#575756'
    })

    let content = ''

    const hasHours = Moment(event.StartDateTime).hours() > 0

    let messageToShare = ''

    if (navigatorParams.id) {
      messageToShare = externalLinks.getMatchesUrl(navigatorParams.id)
    }

    // console.log('event', event)
    // console.log('participants', participants);

    // console.log('IsCurrentUserHost: ', event.IsCurrentUserHost);
    // console.log('IsJoinRequestSent: ', event.IsJoinRequestSent);
    // console.log('IsJoinRequestApproved: ', event.IsJoinRequestApproved);
    // console.log('IsJoinRequestRejected: ', event.IsJoinRequestRejected);
    // console.log('IsInvitationSent: ', event.IsInvitationSent);
    // console.log('IsInvitationAccepted: ', event.IsInvitationAccepted);
    // console.log('IsInvitationDeclined: ', event.IsInvitationDeclined);
    // console.log('***************************************************************************');

    const participationPrice = +event.ParticipationFee
      ? Math.round((+event.ParticipationFee + Number.EPSILON) * 100) / 100
      : 0

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <ScrollView
          style={{ backgroundColor: '#d3d3d3', flex: 1 }}
          contentContainerStyle={{
            paddingTop: 0
          }}
        >
          <View
            style={{
              marginTop: 5,
              marginHorizontal: 10,
              borderRadius: 5,
              overflow: 'hidden'
            }}
          >
            <View style={{ maxHeight: 200 }}>
              <FullWidthImage source={{ uri: event.ImageURL }} style={{ resizeMode: 'cover' }} />
            </View>

            <View
              style={{
                marginLeft: 0,
                marginRight: 0,
                flex: 1,
                paddingBottom: 20,
                paddingTop: 10
              }}
            >
              <View
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  paddingBottom: 20,
                  backgroundColor: '#ffffff',
                  paddingHorizontal: 12,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  overflow: 'hidden'
                }}
              >
                {event.Title && event.Title.length > 0 && (
                  <View style={{ marginTop: 18 }}>
                    <SectionTitle
                      text={event.Title}
                      isSsaEvent={true}
                      messageToShare={messageToShare}
                      isBookmarked={this.state.isBookmarked}
                      toggleBookmark={this.toggleBookmark}
                    />
                  </View>
                )}

                <View
                  style={{
                    flexDirection: 'column',
                    marginLeft: 3,
                    marginTop: event.Title && event.Title.length > 0 ? 2 : 12
                  }}
                >
                  <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Icon2 name="place-icon" size={12} style={{ marginTop: 0, color: '#575756' }} />
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={{
                        fontFamily: fontFamily.gothamMedium,
                        fontSize: 14,
                        marginLeft: 8,
                        lineHeight: 19,
                        color: '#575756'
                      }}
                    >
                      {event.Venue.Title}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={[
                        styles.dateStyle,
                        hasHours ? styles.dateWidthFull : styles.dateWidthShort,
                        { backgroundColor: '#78BC4B', marginTop: 5 }
                      ]}
                    >
                      <Icon2 name="calendar-icon" size={14} color="#ffffff" style={{ marginTop: 3 }} />
                      <Text
                        style={{
                          fontFamily: fontFamily.gothamMedium,
                          color: colors.basicLightText,
                          fontSize: 14,
                          marginLeft: 5,
                          lineHeight: 19,
                          marginTop: Platform.OS === 'ios' ? 4 : 4,
                          marginBottom: Platform.OS === 'ios' ? -4 : -4
                        }}
                      >
                        {hasHours ? Moment(event.StartDateTime).format('  H:mm A') : ''}{' '}
                        {Moment(event.StartDateTime).format('D MMM YYYY')}
                      </Text>
                    </View>
                    <View
                      style={{
                        borderTopWidth: 34,
                        borderRightWidth: 30,
                        borderRightColor: 'transparent',
                        borderTopColor: '#78BC4B',
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderStyle: 'solid',
                        marginTop: 5
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                    {groupIcon}
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={{
                        fontFamily: fontFamily.gothamLight,
                        fontSize: 14,
                        marginLeft: 8,
                        lineHeight: 19,
                        color: '#575756'
                      }}
                    >
                      {ssaEventActivityType[event.ActivityType]}
                    </Text>
                  </View>
                </View>
                {event.Description.length > 0 && (
                  <View style={{ marginTop: 15 }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.gothamLight,
                        fontSize: 12,
                        lineHeight: 17,
                        color: '#575756'
                      }}
                    >
                      {event.Description}
                    </Text>
                  </View>
                )}
                {/*
                <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                  {exclamationIcon}
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{
                      fontFamily: fontFamily.gothamLight,
                      fontSize: 14,
                      marginLeft: 8,
                      lineHeight: 19,
                      color: '#575756',
                    }}
                  >
                    {i18n.t('socialSportsActivity.participants_level')}{' '}
                    {getSsaPlayerLevel(event.PlayerLevel)}
                  </Text>
                </View>
                */}

                <View style={{ flexDirection: 'row', flex: 1, marginTop: 21, marginBottom: 12 }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.gothamMedium,
                      fontSize: 14,
                      lineHeight: 19,
                      color: '#575756'
                    }}
                  >
                    {i18n.t('socialSportsActivity.participants')}{' '}
                    {` ${participants.filter(item => item.Participant !== null).length}/${event.NumberOfParticipants}`}
                  </Text>
                </View>

                {participants && Boolean(participants.length) ? (
                  participants
                    .filter(item => item.Participant !== null)
                    .map((item, i) => {
                      // console.log( 'participant', i, item)
                      // console.log('***************************************************************************')
                      // console.log('event.IsCurrentUserHost', event.IsCurrentUserHost)
                      return (
                        <SsaEventInvitee
                          key={i}
                          updateParticipantsList={() => this.updateParticipantsList()}
                          participant={item}
                          isCurrentUserHost={event.IsCurrentUserHost}
                        />
                      )
                    })
                ) : (
                  <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>You have no requests for participation</Text>
                  </View>
                )}

                {event.ParticipationFee > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      marginTop: 10,
                      borderRadius: 3,
                      height: 40,
                      backgroundColor: '#F2F2F2',
                      paddingLeft: 11,
                      alignItems: 'center'
                    }}
                  >
                    {groupIconLarge}
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={{
                        fontFamily: fontFamily.gothamMedium,
                        fontSize: 16,
                        marginLeft: 16,
                        color: '#575756',
                        marginTop: 3
                      }}
                    >
                      {i18n.t('socialSportsActivity.aed')} {participationPrice}
                    </Text>
                  </View>
                )}

                {this.renderButton()}
              </View>
            </View>
          </View>

          <FlatList
            style={{ marginBottom: 0 }}
            data={ads}
            extraData={this.state}
            renderItem={({ item }) => <Ads ad={item} />}
            keyExtractor={item => item.CampaignId.toString()}
          />
        </ScrollView>
      </View>
    )
  }
}

SsaDetailsScreen.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired,
    getParam: propTypes.func.isRequired
  }).isRequired
}

export default SsaDetailsScreen
