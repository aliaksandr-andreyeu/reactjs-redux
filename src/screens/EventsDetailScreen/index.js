/* eslint-disable react/sort-comp */
import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  Linking,
  TextInput,
} from 'react-native';

import Loading from '../../components/Loading';

import * as AddCalendarEvent from 'react-native-add-calendar-event';

import debounce from 'lodash.debounce';

import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';

import Moment from 'moment';

import FullWidthImage from 'react-native-fullwidth-image';

import Ionicons from 'react-native-vector-icons/Ionicons';

import getLocaleDate from '../../helpers/getLocaleDate';

import env from '../../config';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import HTML from 'react-native-render-html';
import IconCreator from '../../components/Icon';
import { externalLinks, axiosInstance, apiUrls } from '../../constants/api';
import decodeHtmlEntities from '../../helpers/decodeHtmlEntities';
import fontelloConfig from '../../assets/fonts/customicons-config.json';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import styles from './styles';
import colors from '../../constants/colors';
import ActionButton from '../../components/Details/ActionButton';
import DataBox from '../../components/Details/DataBox';
import SectionTitle from '../../components/Details/SectionTitle';
import { htmlStyles } from '../../constants/htmlRendering';
import { fontFamily, fontSize } from '../../constants/fonts';
import Ads from '../../components/UI/Ads';
import Tweet from '../../components/Tweet';
import YouTube from '../../components/YouTube';
import GeneralAdmission from './components/GeneralAdmission';
import i18n from '../../../i18n';

import openExternalLink from '../../helpers/openExternalLink';

import extractTweets from '../../helpers/extractTweets';

import Global from '../../components/global';
import ScrollListContainer from '../../components/ScrollListContainer';
import ScrollListItem from '../../components/ScrollListItem';

import isEqual from 'lodash.isequal';

const Icon = createIconSetFromFontello(fontelloConfig);

export default class EventsDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('events.event_details'),
    };
  };

  state = {
    searchText: '',
    user: {},
    dataSource: {
      isLoading: true,
      eventItem: {},
    },
    isDescriptionVisible: false,
    relatedItems: {
      isLoading: true,
      data: [],
    },
    relatedEventsButtons: {
      prevId: 0,
      nextId: 0,
    },
    modalIsOpen: false,
    ads: [],
    webViewHeight: 0,
    isBookmarked: false,
    isLoading: true,
    coordinates: {},

    premierOnline: false,
    platinumList: false,
  };

  async componentDidMount() {
    const storedValue = await AsyncStorage.getItem('app:user');

    this.setState(
      {
        user: JSON.parse(storedValue),
      },
      () => {
        this._getEvents();
        this._getRelatedEvents();
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props, prevProps)) {
      this._getEvents();
    }
  }

  _getEvents = () => {
    const { navigation } = this.props;

    const eventId = navigation.getParam('id', '');

    // const eventId = 1374;
    // console.log('eventId', eventId, typeof eventId);

    let requests = [
      axiosInstance(apiUrls.getEventById(eventId) + '?langCode=' + i18n.locale.toUpperCase()),
      axiosInstance(apiUrls.getAds(4, 0, 0) + '?langCode=' + i18n.locale.toUpperCase()),
    ];

    if (Global.user.token && Global.user.token.length > 5) {
      requests.push(axiosInstance(apiUrls.getBookmarks));
    }

    Promise.all(requests).then(([event, ads, bookmarks]) => {
      // console.log('event.data', event.data);
      // console.log('event.data.ExternalSource', event.data.ExternalSource );
      // console.log('event.data.AdditionalInfo: ', event.data.AdditionalInfo );

      this.setState({
        ads: ads.data,
        isBookmarked:
          !!bookmarks &&
          !!bookmarks.data.find(
            item => item.EntityName.toLowerCase() === 'event' && item.Eid === event.data.Id
          ),
        dataSource: { eventItem: event.data, isLoading: false },
        isLoading: false,
        coordinates: {
          GeoLatitude: event.data.Geo_lat,
          GeoLongitude: event.data.Geo_lng,
        },

        premierOnline: Boolean(event.data.ExternalSource === 2), // PremierOnline
        platinumList: Boolean(event.data.ExternalSource === 1), // PlatinumList
      });
    });
  };

  _getRelatedEvents = () => {
    this.setState({
      relatedItems: { data: [], isLoading: true },
    });

    headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (Boolean(Global.user && Global.user.token && Global.user.token.length > 5)) {
      headers['auth-token'] = Global.user.token;
    }

    fetch(
      `${env.api}api/relatedposts/Event/${this.props.navigation.getParam(
        'id',
        {}
      )}?langCode=${i18n.locale.toUpperCase()}`,
      {
        method: 'GET',
        headers,
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.Items) {
          if (responseJson.Items.length > 40) {
            responseJson.Items = responseJson.Items.slice(0, 40);
          }

          this.setState({
            relatedItems: { data: responseJson.Items, isLoading: false },
          });
        }
      });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      modalIsOpen: !prevState.modalIsOpen,
    }));
  };

  _toggleDescription = () => {
    console.log(this.state.isDescriptionVisible);
    this.setState({
      isDescriptionVisible: !this.state.isDescriptionVisible,
    });
  };

  _renderItemRelatedPosts = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.push(`${item.EntityName}Detail`, { id: item.Id, object: item });
      }}
    >
      <View style={index == 0 ? styles.boxShadowNoLeftMargin : styles.boxShadow} elevation={5}>
        <Image
          source={{ uri: item.ImageLandscapeThumbUrl }}
          style={{ width: 257, height: 127 }}
          resizeMode="cover"
        />

        <View style={{ height: 53 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              maxWidth: 245,
              marginTop: 11,
              marginLeft: 11,
              color: colors.basicText,
              fontSize: 12,
              fontFamily: fontFamily.gothamBold,
              lineHeight: 19,
            }}
          >
            {item.Title}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              maxWidth: 245,
              marginTop: 7,
              marginLeft: 11,
              color: colors.basicText,
              fontSize: 11,
              fontFamily: fontFamily.gothamMedium,
            }}
          >
            {item.Excerpt}
          </Text>
        </View>

        <View
          style={{
            position: 'absolute',
            left: 15,
            top: 15,
            borderRadius: 60,
            borderColor: '#ffffff',
            borderWidth: 1,
            backgroundColor: '#ffffff',
          }}
        >
          <Text
            style={{
              marginLeft: 0,
              marginTop: 0,
              color: colors.brandColorBright,
              fontSize: 15,
              fontFamily: fontFamily.gothamBold,
              paddingHorizontal: 12,
              paddingTop: 3,
              paddingBottom: 3,
            }}
          >
            {item.EntityName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  _listDividerRelatedPosts = () => <View style={styles.dividerContainerRecommended} />;

  toggleBookmark = () => {
    const { navigation } = this.props;
    const { isBookmarked, dataSource } = this.state;

    const params = {
      Id: dataSource.eventItem.Id,
      Entity: 'event',
    };

    // console.log(navigation.state.params)

    if (isBookmarked) {
      axiosInstance.post(apiUrls.postRemoveBookmark, params).then(() => {
        Global.loadFavorites();

        this.setState(() => ({
          isBookmarked: false,
        }));

        Boolean(navigation.state.params.getBookmarks()) && navigation.state.params.getBookmarks();
      });
    } else {
      axiosInstance.post(apiUrls.postAddBookmark, params).then(data => {
        Global.loadFavorites();

        this.setState(() => ({
          isBookmarked: true,
        }));

        Boolean(navigation.state.params.getBookmarks()) && navigation.state.params.getBookmarks();
      });
    }
  };

  handleGaPurchase = () => {
    console.log('Purchase handled');
  };

  _getDate = item => {
    const hasHours = Moment(item).hours() > 0;
    let date = getLocaleDate(item);
    return date ? (
      <Text
        style={{
          fontFamily: fontFamily.gothamMedium,
          color: colors.basicLightText,
          fontSize: 16,
          lineHeight: 22,
          marginTop: Platform.OS === 'ios' ? 4 : 4,
          marginBottom: Platform.OS === 'ios' ? -4 : -4,
        }}
      >
        {hasHours ? `${Moment().format('H:mm A')} ` : ''}
        {`${date}`}
      </Text>
    ) : null;
  };

  getLocation = () => {
    const { coordinates } = this.state;

    // console.log('coordinates', coordinates)

    const url = externalLinks.getGoogleMapsUrl(coordinates.GeoLatitude, coordinates.GeoLongitude);

    openExternalLink(url);
  };

  setEvent() {
    const { dataSource } = this.state;

    const eventItem = dataSource.eventItem || {};

    const eventConfig = {
      title: eventItem.Title || '',
      startDate: eventItem.EventDateTime ? Moment(eventItem.EventDateTime).toISOString() : '',
      endDate: eventItem.EventEndDateTime ? Moment(eventItem.EventEndDateTime).toISOString() : '',
      location: eventItem.VenueName || '',
      notes: eventItem.Excerpt || '',
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        console.log(JSON.stringify(eventInfo));
      })
      .catch(error => {
        console.log(error);
      });
  }

  registerUser() {
    const { dataSource } = this.state;
    id =
      dataSource && dataSource.eventItem && dataSource.eventItem.Id
        ? dataSource.eventItem.Id
        : false;

    const requests = [axiosInstance.post(`${apiUrls.postEventRegister(id)}`)];

    Promise.all(requests)
      .then(([response]) => {
        console.log('Response: ', response.data);
        this._getEvents();
      })
      .catch(e => console.log('Error:', e));
  }

  unregisterUser() {
    const { dataSource } = this.state;
    id =
      dataSource && dataSource.eventItem && dataSource.eventItem.Id
        ? dataSource.eventItem.Id
        : false;

    const requests = [axiosInstance.post(`${apiUrls.postEventUnregister(id)}`)];

    Promise.all(requests)
      .then(([response]) => {
        console.log('Response: ', response.data);
        this._getEvents();
      })
      .catch(e => console.log('Error:', e));
  }

  render() {
    const { navigation } = this.props;
    const {
      dataSource,
      relatedItems,
      relatedEventsButtons,
      ads,
      webViewHeight,
      isBookmarked,
      isLoading,
      premierOnline,
      platinumList,
    } = this.state;

    // console.log('~~~ premierOnline: ', Boolean( premierOnline ))
    // console.log('~~~ platinumList: ', Boolean( platinumList ))

    const groupIcon = IconCreator.getIcon(IconCreator.iconLibraries.materialIcons, 'group', {
      size: 22,
      color: colors.basicText,
    });

    let content = '';

    const hasHours = Moment(dataSource.eventItem.EventDateTime).hours() > 0;

    if (dataSource.eventItem.Description) {
      content = dataSource.eventItem.Description;
    }
    if (dataSource.eventItem.Content) {
      content = dataSource.eventItem.Content;
    }

    const decodedContent = decodeHtmlEntities(content.replace(/<(?:.|\n)*?>/gm, ''));

    if (isLoading) {
      return <Loading />;
    }

    // console.log('AdditionalInfo', Boolean(dataSource && dataSource.eventItem && dataSource.eventItem.AdditionalInfo));

    const htmlWithTweets = extractTweets(content);
    let YouTubeLinks = dataSource.eventItem.ExternalContent || [];

    const isRegistrationRequired =
      dataSource && dataSource.eventItem && dataSource.eventItem.IsRegistrationRequired
        ? dataSource.eventItem.IsRegistrationRequired
        : false;
    const isAlreadyRegistered =
      dataSource && dataSource.eventItem && dataSource.eventItem.IsAlreadyRegistered
        ? dataSource.eventItem.IsAlreadyRegistered
        : false;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={{ backgroundColor: '#d3d3d3', flex: 1 }}
          contentContainerStyle={{
            paddingTop: 0,
          }}
          onScroll={this._onScrollViewScroll}
        >
          <View
            style={{
              marginHorizontal: 12,
            }}
          >
            <View
              style={{
                marginLeft: 0,
                marginRight: 0,
                flex: 1,
                //paddingBottom: 25,
                paddingBottom: 8,
                paddingTop: 10,
              }}
            >
              <View
                style={{
                  marginLeft: 0,
                  marginRight: 0,

                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  overflow: 'hidden',

                  backgroundColor: '#ffffff',
                }}
              >
                <FullWidthImage source={{ uri: dataSource.eventItem.ImageSquareThumbURL }} />
              </View>
              <View
                style={{
                  marginLeft: 0,
                  marginRight: 0,

                  paddingBottom: 5,
                  paddingHorizontal: 16,

                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  overflow: 'hidden',

                  backgroundColor: '#ffffff',
                }}
              >
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 5,
                  }}
                >
                  <SectionTitle
                    text={dataSource.eventItem.Title}
                    messageToShare={externalLinks.getEventsUrl(dataSource.eventItem.Id)}
                    isBookmarked={isBookmarked}
                    toggleBookmark={this.toggleBookmark}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    marginBottom: 20,
                    //marginLeft: 2,
                    marginTop: 4,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      marginBottom: 4,
                    }}
                    onPress={this.getLocation}
                  >
                    <View
                      style={{
                        flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                        flex: 1,
                      }}
                    >
                      <Icon
                        name="place-icon"
                        size={14}
                        style={{
                          marginTop: 2,
                          ...(i18n.locale.toLowerCase() == 'en'
                            ? {
                                marginRight: 8,
                              }
                            : {
                                marginLeft: 8,
                              }),
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={{
                          fontFamily: fontFamily.gothamMedium,
                          fontSize: 14,
                        }}
                      >
                        {dataSource.eventItem.VenueName}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                      marginTop: 10,
                      marginLeft: -16,
                      // borderWidth: 1,
                      // borderColor: '#ff0000',
                    }}
                  >
                    {/* -------------------------------------------------------------------- */}
                    <TouchableOpacity
                      style={{
                        flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                        flexGrow: 0,
                        flexShrink: 0,
                        flexBasis: 'auto',
                        // borderWidth: 1,
                        // borderColor: '#ff0000',
                      }}
                      activeOpacity={0.9}
                      onPress={() => {
                        this.setEvent();
                      }}
                    >
                      <View
                        style={{
                          ...styles.dateStyle,
                          flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                        }}
                      >
                        <Icon
                          name="calendar-icon"
                          size={14}
                          color="#ffffff"
                          style={{
                            ...(i18n.locale.toLowerCase() == 'en'
                              ? {
                                  marginRight: 8,
                                }
                              : {
                                  marginLeft: 8,
                                }),
                            marginTop: 3,
                          }}
                        />
                        {this._getDate(dataSource.eventItem.EventDateTime)}
                      </View>
                      <View
                        style={{
                          ...(i18n.locale.toLowerCase() == 'en'
                            ? {
                                borderRightWidth: 30,
                                borderRightColor: 'transparent',
                              }
                            : {
                                borderLeftWidth: 30,
                                borderLeftColor: 'transparent',
                              }),
                          borderTopWidth: 34,
                          borderTopColor: '#2F8C83',
                          width: 0,
                          height: 0,
                          backgroundColor: 'transparent',
                          borderStyle: 'solid',
                        }}
                      />
                    </TouchableOpacity>
                    {/* -------------------------------------------------------------------- */}
                  </View>
                </View>

                <View>
                  <>
                    <HTML
                      html={htmlWithTweets.html}
                      renderers={{
                        youtube: () => {
                          return (
                            <YouTube
                              link={YouTubeLinks.shift()}
                              //links={dataSource.newsItem.ExternalContent}
                            />
                          );
                        },
                        tweet: attributes => {
                          if (attributes.tweet) {
                            const tweet = htmlWithTweets.tweets[attributes.tweet];
                            return <Tweet key={Date.now() + '-' + Math.random()} tweet={tweet} />;
                          }
                          return null;
                        },
                        a: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                          if (htmlAttribs.href) {
                            return (
                              <Text
                                key={Date.now() + '-' + Math.random(htmlAttribs.href.length)}
                                onPress={() => Linking.openURL(htmlAttribs.href)}
                              >
                                {children}
                              </Text>
                            );
                          }
                        },
                      }}
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
                  </>
                </View>

                {dataSource.eventItem.IsReservedSeating && !dataSource.eventItem.IsFree && (
                  <View style={{ paddingHorizontal: 10 }}>
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ fontFamily: fontFamily.gothamMedium }}>
                        {i18n.t('events.available_tickets')}
                      </Text>
                    </View>
                    <Text
                      style={{ fontFamily: fontFamily.gothamMedium, marginBottom: 20 }}
                    >{`from ${dataSource.eventItem.MinPrice} ${dataSource.eventItem.Currency}`}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          Boolean(Global.user && Global.user.token && Global.user.token.length > 5)
                        ) {
                          navigation.navigate('SeatReservationScreen', {
                            eventId: dataSource.eventItem.Id,
                            event: dataSource.eventItem,
                          });
                        } else {
                          Alert.alert(
                            i18n.t('alerts.unauth_buy_tickets'),
                            false,
                            [
                              {
                                text: i18n.t('alerts.login'),
                                onPress: () => this.props.navigation.navigate('SignIn', {}),
                              },
                              {
                                text: i18n.t('alerts.cancel'),
                                style: 'cancel',
                              },
                            ],
                            {
                              cancelable: false,
                            }
                          );
                        }
                      }}
                      style={{
                        backgroundColor: '#000066',
                        borderRadius: 4,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontFamily.gothamMedium,
                          color: '#ffffff',
                          fontSize: 20,
                        }}
                      >
                        {i18n.t('events.buy_tickets')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
              >
                {dataSource.eventItem.Infographics &&
                dataSource.eventItem.Infographics.length > 0 ? (
                  <>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                        marginBottom: 10,
                        marginTop: 22,
                        // marginTop: 5,
                        // marginBottom: 0,
                      }}
                    >
                      <View
                        style={{
                          // flex: 4,
                          flexGrow: 0,
                          flexShrink: 0,
                          flexBasis: 'auto',
                          paddingRight: i18n.locale.toLowerCase() == 'en' ? 16 : 0,
                          paddingLeft: i18n.locale.toLowerCase() == 'en' ? 0 : 16,
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fontFamily.gothamBold,
                            fontSize: 15,
                            color: '#0177C1',
                            lineHeight: 21,
                          }}
                        >
                          {i18n.t('events.did_you_know')}
                        </Text>
                      </View>
                      {/*
                      <View 
                        style={{ 
                          // flex: 9, 
                          flexBasis: '100%',
                          flexGrow: 0,
                          flexShrink: 1,
                          
                          alignSelf: 'center' 
                        }}
                      >
                        <View 
                          style={{
                            ...styles.horizontalLine, 
                          }}
                        />
                      </View>
                      */}
                    </View>

                    <View
                      style={{
                        flex: 1,
                        flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                        backgroundColor: `${dataSource.eventItem.Infographics[0].ColorCode}`,
                      }}
                    >
                      <View
                        style={{
                          flex: 3,
                          paddingTop: 10,
                          paddingLeft: i18n.locale.toLowerCase() == 'en' ? 10 : 0,
                          paddingRight: i18n.locale.toLowerCase() == 'en' ? 0 : 10,
                          paddingBottom: 10,
                          // borderWidth: 1,
                          // borderColor: '#ff00ff',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FullWidthImage
                          source={{
                            uri: dataSource.eventItem.Infographics[0].ImageThumbURL,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          flex: 10,
                          // borderWidth: 1,
                          // borderColor: '#ff00ff',
                          // alignItems: "center",
                          justifyContent: 'center',
                          paddingTop: 18,
                          paddingBottom: 14,
                        }}
                      >
                        {dataSource.eventItem.Infographics[0].HeadingText ? (
                          <Text
                            style={{
                              width: '100%',
                              marginTop: 0,
                              marginBottom: 4,
                              fontFamily: fontFamily.gothamBold,
                              fontSize: 20,
                              color: colors.basicLightText,
                              paddingLeft: i18n.locale.toLowerCase() == 'en' ? 20 : 10,
                              paddingRight: i18n.locale.toLowerCase() == 'en' ? 10 : 20,
                              paddingBottom: 0,
                              lineHeight: 28,
                              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                              // borderWidth: 1,
                              // borderColor: '#ff00ff',
                            }}
                          >
                            {dataSource.eventItem.Infographics[0].HeadingText}
                          </Text>
                        ) : null}
                        <Text
                          style={{
                            width: '100%',
                            marginTop: 0,
                            fontFamily: fontFamily.gothamBold,
                            fontSize: 13,
                            color: colors.basicLightText,
                            paddingTop: 0,
                            paddingLeft: i18n.locale.toLowerCase() == 'en' ? 20 : 10,
                            paddingRight: i18n.locale.toLowerCase() == 'en' ? 10 : 20,
                            lineHeight: 21,
                            // borderWidth: 1,
                            // borderColor: '#ff00ff',
                            textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                          }}
                        >
                          {dataSource.eventItem.Infographics[0].DescriptionText}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : null}

                {dataSource.eventItem.PricingCategories.length > 0 &&
                  !dataSource.eventItem.IsReservedSeating &&
                  !dataSource.eventItem.IsFree && (
                    <View
                      style={{
                        marginTop: 32,
                        marginBottom: -16,
                        marginLeft: -15,
                        marginRight: -15,
                      }}
                    >
                      <GeneralAdmission
                        premierOnline={premierOnline}
                        platinumList={platinumList}
                        categories={dataSource.eventItem.PricingCategories}
                      />
                    </View>
                  )}

                {isRegistrationRequired ? (
                  <>
                    <View
                      style={{
                        borderRadius: 5,
                        marginTop: 40,
                        marginBottom: 20,
                        backgroundColor: '#ffffff',
                        paddingTop: 10,
                        paddingHorizontal: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontFamily.gothamBold,
                          color: colors.basicText,
                          fontSize: fontSize.large,
                          marginBottom: 16,
                          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                        }}
                      >
                        {i18n.t('events.event_registration')}
                      </Text>

                      <Text
                        style={{
                          fontFamily: fontFamily.gothamMedium,
                          color: colors.themeColor,
                          fontSize: fontSize.extraRegular,
                          marginBottom: 2,
                          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                        }}
                      >
                        {i18n.t('events.first_name')}
                      </Text>

                      <TextInput
                        editable={false}
                        placeholder={i18n.t('events.first_name')}
                        placeholderTextColor="#8C9091"
                        returnKeyType="go"
                        style={{
                          ...styles.searchFieldList,
                          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                          marginBottom: 16,
                        }}
                        value={
                          Global.user && Global.user.firstName ? Global.user.firstName.trim() : ''
                        }
                      />

                      <Text
                        style={{
                          fontFamily: fontFamily.gothamMedium,
                          color: colors.themeColor,
                          fontSize: fontSize.extraRegular,
                          marginBottom: 2,
                          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                        }}
                      >
                        {i18n.t('events.last_name')}
                      </Text>

                      <TextInput
                        editable={false}
                        placeholder={i18n.t('events.last_name')}
                        placeholderTextColor="#8C9091"
                        returnKeyType="go"
                        style={{
                          ...styles.searchFieldList,
                          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                          marginBottom: 24,
                        }}
                        value={
                          Global.user && Global.user.lastName ? Global.user.lastName.trim() : ''
                        }
                      />

                      {isAlreadyRegistered ? (
                        <View
                          style={{
                            backgroundColor: colors.warningBackgroundAlt,
                            borderRadius: 5,
                            marginBottom: 16,
                            padding: 10,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontFamily.gothamRegular,
                              fontSize: fontSize.small,
                              color: colors.basicLightText,
                              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                            }}
                          >
                            {i18n.t('events.event_already_registered')}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <ActionButton
                      onPress={() => {
                        if (
                          Boolean(Global.user && Global.user.token && Global.user.token.length > 5)
                        ) {
                          isAlreadyRegistered ? this.unregisterUser() : this.registerUser();
                        } else {
                          Alert.alert(
                            i18n.t('alerts.unauth_buy_tickets'),
                            false,
                            [
                              {
                                text: i18n.t('alerts.login'),
                                onPress: () => this.props.navigation.navigate('SignIn', {}),
                              },
                              {
                                text: i18n.t('alerts.cancel'),
                                style: 'cancel',
                              },
                            ],
                            {
                              cancelable: false,
                            }
                          );
                        }
                      }}
                      label={
                        isAlreadyRegistered
                          ? i18n.t('events.event_unregister')
                          : i18n.t('events.event_register')
                      }
                    />
                  </>
                ) : null}

                {Boolean(
                  dataSource && dataSource.eventItem && Boolean(dataSource.eventItem.AdditionalInfo)
                ) && (
                  <View
                    style={{
                      marginTop: 32,
                      marginBottom: 8,
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
                        paddingBottom: 0,
                      }}
                    >
                      <HTML
                        html={dataSource.eventItem.AdditionalInfo}
                        renderers={{
                          a: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                            if (htmlAttribs.href) {
                              return (
                                <Text
                                  key={Date.now() + '-' + Math.random(htmlAttribs.href.length)}
                                  onPress={() => Linking.openURL(htmlAttribs.href)}
                                >
                                  {children}
                                </Text>
                              );
                            }
                          },
                        }}
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
                  </View>
                )}

                {relatedItems.data && relatedItems.data.length > 0 && (
                  <View
                    style={{
                      // borderColor: "#ff0000",
                      // borderWidth: 1,
                      marginTop: 16,
                      marginLeft: -12,
                      marginRight: -12,
                    }}
                  >
                    <ScrollListContainer
                      headingLabel={i18n.t('events.related')}
                      targetScreen="Events"
                    >
                      <FlatList
                        data={relatedItems.data}
                        renderItem={({ item, index }) => (
                          <ScrollListItem
                            isRelated={true}
                            src={item.ImageLandscapeThumbUrl}
                            description={item.Title}
                            key={index}
                            navigationModel={{
                              targetScreen: `${item.EntityName}Detail`,
                              data: { id: item.Id, object: item },
                            }}
                          />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      />
                    </ScrollListContainer>
                  </View>
                )}
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
          {relatedEventsButtons.nextId > 0 && (
            <View
              style={{
                width: '100%',
                paddingBottom: 25,
                paddingTop: 0,
                paddingHorizontal: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.push('EventDetail', {
                    id: relatedEventsButtons.nextId,
                    object: {},
                  });
                }}
                style={{
                  padding: 10,
                  width: '100%',
                  backgroundColor: '#2F8C83',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="down-button" size={13} color="#ffffff" style={{ marginTop: -1 }} />
                  <Text
                    style={{
                      fontFamily: fontFamily.gothamBold,
                      fontSize: 15,
                      color: colors.basicLightText,
                      marginLeft: 10,
                    }}
                  >
                    {i18n.t('events.next_event')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
