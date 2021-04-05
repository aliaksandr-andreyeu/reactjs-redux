import axios from 'axios';
import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import { axiosInstance, apiUrls } from '../../constants/api';
import styles from './styles';
import { sections } from './constants';
import { getListItemParams } from './helpers';
import Icon from '../../components/Icon';
import { fontSize, fontFamily } from '../../constants/fonts';
import colors from '../../constants/colors';
import VenueMenu from '../VenuesScreen/components/VenueMenu';
import ScrollListContainer from '../../components/ScrollListContainer';
import ScrollListItem from '../../components/ScrollListItem';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import i18n from '../../../i18n';

import { htmlStyles } from '../../constants/htmlRendering';

import HTML from 'react-native-render-html';

import { externalLinks } from '../../constants/api';
import openExternalLink from '../../helpers/openExternalLink';

import Loading from '../../components/Loading';
import AsyncStorage from '@react-native-community/async-storage';
import Global from '../../components/global';

import getSportsIcon from '../../helpers/sportsIconMapper';

import getSvgIcon from '../../helpers/iconMapper';

import ActionButton from '../../components/Details/ActionButton';

class VenueDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('venues.venue_details'),
    };
  };

  state = {
    data: {},
    events: [],
    ssa: [],
    packages: [],
    openHours: [],
    amenities: [],
    sportsOffered: [],
    otherVenues: [],
    isLoading: true,
    isBookmarked: false,
    coordinates: {},
  };

  async componentDidMount() {
    const storedValue = await AsyncStorage.getItem('app:user');
    const { navigation } = this.props;

    const venueItemProps = navigation.getParam('item', {});

    // console.log('componentDidMount() venueItemProps', venueItemProps);

    if (venueItemProps.Id) {
      const params = {
        vn: venueItemProps.Id,
      };

      const venueDetails = axiosInstance(
        `${apiUrls.getVenueById(venueItemProps.Id)}?langCode=${i18n.locale.toUpperCase()}`
      );
      const bookmarksList = axiosInstance(
        `${apiUrls.getBookmarks}?langCode=${i18n.locale.toUpperCase()}`
      );

      const isAuthorized = false;

      const requests = isAuthorized ? [venueDetails, bookmarksList] : [venueDetails];

      axios
        .all(requests)
        .then(([venueDetailsResponse, bookmarks]) => {
          // console.log('venueDetailsResponse', venueDetailsResponse.data);

          this.setState({
            data: venueDetailsResponse.data,
            isBookmarked:
              !!bookmarks &&
              !!bookmarks.data.find(
                item => item.EntityName.toLowerCase() === 'venue' && item.Eid === venueItemProps.Id
              ),
            events: venueDetailsResponse.data.Events,
            ssa: venueDetailsResponse.data.SsaEvents,
            openHours: venueDetailsResponse.data.OpenHours,
            amenities: venueDetailsResponse.data.Amenities,
            sportsOffered: venueDetailsResponse.data.SportsOffered,
            otherVenues: venueDetailsResponse.data.OtherVenues,
            packages: venueDetailsResponse.data.Activities,
            coordinates: {
              GeoLatitude: venueDetailsResponse.data.GeoLatitude,
              GeoLongitude: venueDetailsResponse.data.GeoLongitude,
            },
            isLoading: false,
          });
        })
        .catch(e => {
          console.warn(e);
          this.setState({
            isLoading: false,
          });
        });
    }
  }

  toggleBookmark = () => {
    const { isBookmarked } = this.state;

    const dataSource = this.props.navigation.getParam('item', {});

    const params = {
      Id: dataSource.Id,
      Entity: 'venue',
    };

    if (isBookmarked) {
      axiosInstance.post(apiUrls.postRemoveBookmark, params).then(() => {
        Global.loadFavorites();

        this.setState(() => ({
          isBookmarked: false,
        }));
      });
    } else {
      axiosInstance.post(apiUrls.postAddBookmark, params).then(data => {
        Global.loadFavorites();

        this.setState(() => ({
          isBookmarked: true,
        }));
      });
    }
  };

  renderScrollableSection = (type, list, title, withPrice) => {
    // console.log('renderScrollableSection', title, type, list)
    return (
      <ScrollListContainer headingLabel={title}>
        <FlatList
          data={list}
          renderItem={item => this.renderScrollableSectionItem(item.item, type, list, withPrice)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </ScrollListContainer>
    );
  };

  renderScrollableSectionItem = (item, type, list, withPrice) => {
    // console.log('renderScrollableSection', item)
    const { screen, title, imageUri } = getListItemParams(item, type);
    return (
      <ScrollListItem
        src={imageUri}
        description={title}
        key={item.Id}
        isRecommendedContent={true}
        isPrice={Boolean(withPrice)}
        price={item.Price ? item.Price : 0}
        ////////////////////////////////////////////////////////
        navigationModel={{
          targetScreen: screen,
          data: {
            id: item.Id,
            item,
            list,
            params: {
              id: item.Id,
            },
          },
        }}
        ////////////////////////////////////////////////////////
      />
    );
  };

  getLocation = () => {
    const { coordinates } = this.state;

    const url = externalLinks.getGoogleMapsUrl(coordinates.GeoLatitude, coordinates.GeoLongitude);

    openExternalLink(url);
  };

  render() {
    const { navigation } = this.props;
    const {
      events,
      ssa,
      packages,
      isLoading,
      isBookmarked,
      amenities,
      openHours,
      sportsOffered,
      otherVenues,
      data,
    } = this.state;

    // console.log('render() item', navigation.getParam('item', {}));

    const { getIcon, iconLibraries } = Icon;

    // console.log('sportsOffered', sportsOffered);
    // console.log('otherVenues', otherVenues)

    if (isLoading) {
      return <Loading />;
    }

    const screenWidth = Dimensions.get('window').width;

    return (
      <ScrollView style={[styles.container]}>
        <View
          style={{
            ...styles.innerWrapper,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden',
          }}
        >
          <Image
            style={{
              height: screenWidth * 0.65,
            }}
            resizeMode="cover"
            source={{ uri: data.ImageThumbUrl }}
          />
          <View
            style={{
              backgroundColor: colors.backgroundLight,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <View
              style={{
                flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: colors.featureColor1,
                  fontSize: fontSize.large,
                  fontFamily: fontFamily.gothamBold,
                  lineHeight: 26,
                  flex: 2.5,
                  marginTop: 10,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
              >
                {data.Title}
              </Text>
              <VenueMenu
                isBookmarked={isBookmarked}
                toggleBookmark={this.toggleBookmark}
                id={data.Id}
                coordinates={this.state.coordinates}
                navigation={navigation}
              />
            </View>
            <TouchableOpacity
              style={{
                marginBottom: 12,
              }}
              onPress={this.getLocation}
            >
              <View
                style={{
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                  justifyContent: 'flex-start',
                }}
              >
                {getIcon(iconLibraries.fontAwesome5, 'map-marker-alt', {
                  size: fontSize.small,
                  color: colors.darkIcon,
                })}
                <Text
                  style={{
                    color: colors.textBasic,
                    fontSize: fontSize.regular,
                    marginLeft: i18n.locale.toLowerCase() == 'en' ? 8 : 0,
                    marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 8,
                    fontFamily: fontFamily.gothamBold,
                    lineHeight: 20,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                  }}
                >
                  {data.FullAddress}
                </Text>
              </View>
            </TouchableOpacity>
            <View>
              <HTML
                html={data.Description ? data.Description : ''}
                renderers={{}}
                baseFontStyle={{
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
                tagsStyles={{
                  ...htmlStyles,
                  img: {
                    maxWidth: '100%',
                    marginTop: 4,
                    marginBottom: 4,
                  },
                }}
              />
            </View>
            {/*
            <Text
              style={{
                color: colors.textBasic,
                fontSize: fontSize.regular,
                fontFamily: fontFamily.gothamMedium,
                lineHeight: 19,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
              }}
            >
              {data.Description}
            </Text>
            */}
            {/*
            <View>
              <ActionButton
                onPress={() => {
                  console.log('GO');
                  Linking.openURL('shailapp://shail.ae')
                }}
                label={"Open S'hail"}
              />              
            </View>
            */}
          </View>
        </View>

        {data && Boolean(data.AditionalInfo) && (
          <View
            style={{
              marginTop: 12,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                paddingHorizontal: 4,
                fontSize: fontSize.regular,
                color: colors.headingBasic,
                fontFamily: fontFamily.gothamMedium,
                textTransform: 'uppercase',
                marginBottom: 12,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
              }}
            >
              {i18n.t('more.additional_info')}
            </Text>
            <View
              style={{
                borderRadius: 5,
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.gothamLight,
                  fontSize: fontSize.regular,
                  color: colors.basicText,
                  lineHeight: fontSize.regular + 8,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
              >
                {data.AditionalInfo}
              </Text>
            </View>
          </View>
        )}

        {sportsOffered && sportsOffered.length ? (
          <View
            style={{
              marginTop: 8,
            }}
          >
            <Text
              style={{
                marginBottom: 10,
                fontWeight: 'normal',
                fontFamily: fontFamily.gothamMedium,
                fontSize: fontSize.regular,
                color: colors.themeColor,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                textTransform: 'uppercase',
              }}
            >
              {i18n.t('venues.sportsOffered')}
            </Text>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                marginBottom: 15,
                paddingTop: 12,
                paddingBottom: 8,
                paddingRight: 15,
                paddingLeft: 15,
              }}
            >
              <View
                style={{
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                  flexWrap: 'wrap',
                }}
              >
                {sportsOffered.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                      alignItems: 'center',
                      width: '50%',
                      paddingRight: 10,
                      // paddingRight: i18n.locale.toLowerCase() == 'en' ? 12 : 0,
                      // paddingLeft: i18n.locale.toLowerCase() == 'en' ? 0 : 12,
                      marginBottom: 4,
                      // borderWidth: 1,
                      // borderColor: "#ff0000",
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // borderWidth: 1,
                        // borderColor: "#ff0000",
                      }}
                    >
                      {item.Id && getSportsIcon(item.Id, { height: 20, width: 20 })}
                    </View>
                    <Text
                      style={{
                        fontSize: fontSize.regular,
                        fontFamily: fontFamily.gothamMedium,
                        color: colors.textBasic,
                        lineHeight: fontSize.regular + 14,
                        textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                        textAlignVertical: 'center',
                        marginLeft: i18n.locale.toLowerCase() == 'en' ? 10 : 0,
                        marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 10,
                      }}
                    >
                      {item.Title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {!!packages.length &&
          this.renderScrollableSection(
            sections.packages.type,
            packages,
            sections.packages.title(),
            true
          )}
        {!!ssa.length &&
          this.renderScrollableSection(sections.ssa.type, ssa, sections.ssa.title(), true)}
        {!!events.length &&
          this.renderScrollableSection(sections.events.type, events, sections.events.title(), true)}

        {openHours && openHours.length ? (
          <View
            style={{
              backgroundColor: 'rgb(126, 176, 74)',
              borderRadius: 10,
              marginBottom: 15,
              padding: 10,
              paddingTop: 15,
            }}
          >
            <Text
              style={{
                color: 'white',
                marginBottom: 10,
                fontFamily: fontFamily.gothamMedium,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
              }}
            >
              {i18n.t('venues.openingHours')}
            </Text>
            {openHours.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontFamily: fontFamily.gothamMedium,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                  }}
                >
                  {item.WorkdayName}
                </Text>

                {item.ClosedAllDay ? (
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: fontFamily.gothamMedium,
                      textAlign: i18n.locale.toLowerCase() == 'en' ? 'right' : 'left',
                    }}
                  >
                    {'Closed'}
                  </Text>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fontFamily.gothamMedium,
                        textAlign: i18n.locale.toLowerCase() == 'en' ? 'right' : 'left',
                      }}
                    >
                      {item.Start}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fontFamily.gothamMedium,
                        textAlign: i18n.locale.toLowerCase() == 'en' ? 'right' : 'left',
                      }}
                    >
                      {' - '}
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: fontFamily.gothamMedium,
                        textAlign: i18n.locale.toLowerCase() == 'en' ? 'right' : 'left',
                      }}
                    >
                      {item.Finish}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : null}

        {amenities && amenities.length ? (
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              marginBottom: 15,
              padding: 10,
              paddingTop: 15,
            }}
          >
            <Text
              style={{
                marginBottom: 10,
                fontWeight: 'normal',
                fontFamily: fontFamily.gothamMedium,
                fontSize: fontSize.regular,
                color: colors.themeColor,
                lineHeight: fontSize.regular + 8,
                textTransform: 'uppercase',
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
              }}
            >
              {i18n.t('venues.amenities')}
            </Text>
            <View
              style={{
                flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                flexWrap: 'wrap',
              }}
            >
              {amenities.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                    alignItems: 'center',
                    marginRight: i18n.locale.toLowerCase() == 'en' ? 10 : 0,
                    marginLeft: i18n.locale.toLowerCase() == 'en' ? 0 : 10,
                    marginBottom: 5,
                    width: '45%',
                  }}
                >
                  <View
                    style={{
                      width: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {item.Icon && getSvgIcon(item.Icon, { height: 15, width: 15 })}
                  </View>
                  <Text
                    style={{
                      marginLeft: i18n.locale.toLowerCase() == 'en' ? 8 : 0,
                      marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 8,
                      fontFamily: fontFamily.gothamMedium,
                      textAlignVertical: 'center',
                      textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                    }}
                  >
                    {item.Title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {!!otherVenues.length &&
          this.renderScrollableSection(
            sections.venues.type,
            otherVenues,
            i18n.t('venues.other_locations').toUpperCase()
          )}
      </ScrollView>
    );
  }
}

VenueDetails.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default VenueDetails;
