import React, { Component } from 'react'
import { View, ScrollView, TouchableOpacity, Text, FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { withNavigationFocus } from 'react-navigation'
import Activity from './components/Activity'
import Invitation from './components/Invitation'
import styles from './styles'
import Icon from '../../components/Icon'
import { fontSize } from '../../constants/fonts'
import Tabs from '../../components/UI/Tabs'
import { axiosInstance, apiUrls } from '../../constants/api'
import { mapInvitation, mapPublishedEvent } from '../../helpers/mappers'
import Loading from '../../components/Loading'
import { tabs } from './constants'
import i18n from '../../../i18n'
import { NavHeaderUser } from '../../components/NavHeaderUser'

class MyActivitiesScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('activities.matches')
    }
  }

  constructor(props) {
    super(props)

    const {
      navigation: { getParam }
    } = this.props
    const currentTab = getParam('currentTab', 0)

    this.state = {
      currentTab,
      allActivities: [],
      myActivities: [],
      invitations: [],
      isLoading: true,
      isInitialRendering: true,
      userId: ''
    }
  }

  componentDidMount() {
    const requests = [
      axiosInstance(apiUrls.getAllPublishedEvents),
      axiosInstance(apiUrls.getMyActivities),
      axiosInstance(apiUrls.getMyInvitations),
      axiosInstance(apiUrls.getAccountDetails)
    ]

    Promise.all(requests)
      .then(([publishedEvents, activities, invitations, accountDetails]) => {
        // console.log('activities', activities.data.Items.length )

        const userId = accountDetails.data.Id

        const filteredPublishedEvents = publishedEvents.data.Items.filter(
          item => new Date(item.StartDateTime) > Date.now()
        )
        const filteredActivities = activities.data.Items.filter(
          item => item.IsActive && new Date(item.StartDateTime) > Date.now()
        )

        // console.log('filteredActivities', this.mapActivitiesWithUserId(filteredActivities, userId));

        this.setState({
          allActivities: this.mapActivitiesWithUserId(filteredPublishedEvents, userId),
          myActivities: this.mapActivitiesWithUserId(filteredActivities, userId),
          invitations: invitations.data,
          isLoading: false,
          userId
        })
      })
      .catch(err => {
        console.log(err)

        this.setState({
          isLoading: false
        })
      })
  }

  componentDidUpdate(prevProps) {
    const { userId } = this.state
    const { isFocused } = this.props

    if (isFocused && prevProps.isFocused !== isFocused) {
      this.setState({
        isLoading: true
      })

      const requests = [axiosInstance(apiUrls.getAllPublishedEvents), axiosInstance(apiUrls.getMyActivities)]

      Promise.all(requests)
        .then(([publishedEvents, activities]) => {
          const filteredPublishedEvents = publishedEvents.data.Items.filter(
            item => new Date(item.StartDateTime) > Date.now()
          )
          const filteredActivities = activities.data.Items.filter(
            item => item.IsActive && new Date(item.StartDateTime) > Date.now()
          )

          this.setState({
            allActivities: this.mapActivitiesWithUserId(filteredPublishedEvents, userId),
            myActivities: this.mapActivitiesWithUserId(filteredActivities, userId),
            isInitialRendering: false,
            isLoading: false
          })
        })
        .catch(err => {
          console.log(err)

          this.setState({
            isLoading: false
          })
        })
    }
  }

  mapActivitiesWithUserId = (list, userId) => {
    if (userId) {
      return list.map(item => ({
        ...item,
        isCreatedByUser: item.CreatorUserId === userId
      }))
    }

    return []
  }

  changeTab = tabIndex => {
    this.setState({
      currentTab: tabIndex
    })
  }

  handleInvitation = code => {
    const { invitations } = this.state

    this.setState({
      invitations: invitations.filter(item => item.Code !== code)
    })
  }

  deleteEvent = id => {
    axiosInstance.delete(apiUrls.deleteEventById(id)).then(() => {
      this.handleActivityButton(id)
    })
  }

  handleActivityButton = id => {
    const { allActivities, myActivities } = this.state

    this.setState({
      allActivities: allActivities.filter(item => item.Id !== id),
      myActivities: myActivities.filter(item => item.Id !== id)
    })
  }

  getEmptyBoxMessage = () => {
    const { currentTab } = this.state

    switch (currentTab) {
      case 0:
        return i18n.t('activities.no_activities_created_by_user')
      case 1:
        return i18n.t('activities.no_pending_invitations')
      default:
        return ''
    }
  }

  renderActivities = (list, renderItem) => {
    if (!list.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyContainerText}>{this.getEmptyBoxMessage()}</Text>
        </View>
      )
    }
    return (
      <View>
        <FlatList
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          data={list}
          extraData={this.state}
          keyExtractor={item => (item.id ? `${item.id}` : `${Math.random()}`)}
          renderItem={({ item }) => renderItem(item)}
        />
      </View>
    )
  }

  renderActivity = item => {
    const { currentTab } = this.state

    return (
      <Activity
        key={item.Code}
        isCreatedByUser={item.isCreatedByUser}
        deleteEvent={this.deleteEvent}
        showLoading={this.showLoading}
        isMyActivity={currentTab === 1}
        {...mapPublishedEvent(item)}
      />
    )
  }

  renderInvitation = item => (
    <Invitation key={item.Code} handleInvitation={this.handleInvitation} {...mapInvitation(item)} />
  )

  showLoading = () => {
    this.setState({
      isLoading: true
    })
  }

  render() {
    const { currentTab, allActivities, myActivities, invitations, isLoading } = this.state

    if (isLoading) {
      return <Loading />
    }

    // console.log('allActivities', allActivities);
    // console.log('myActivities', myActivities)

    return (
      <View style={styles.container}>
        <Tabs isActivity currentTab={currentTab} tabs={tabs()} onPress={this.changeTab} />
        <ScrollView contentContainerStyle={[styles.innerContainer]}>
          {currentTab === 0 && this.renderActivities(myActivities, this.renderActivity)}
          {currentTab === 1 && this.renderActivities(invitations, this.renderInvitation)}
        </ScrollView>
      </View>
    )
  }
}

MyActivitiesScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired
  }).isRequired,
  isFocused: PropTypes.bool.isRequired
}

export default withNavigationFocus(MyActivitiesScreen)
