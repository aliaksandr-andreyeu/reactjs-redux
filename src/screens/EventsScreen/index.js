import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';

import isEqual from 'lodash.isequal';

import Loading from '../../components/Loading';

import Geolocation from '@react-native-community/geolocation';

import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { externalLinks, axiosInstance, apiUrls } from '../../constants/api';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import styles from './styles';
import FilterAndSearchBar from '../../components/FilterAndSearchBar';
import * as actions from './actions';

import DXBLogo from '../../assets/images/dxb_gray.svg';

import i18n from '../../../i18n';

import { fontFamily } from '../../constants/fonts';
import colors from '../../constants/colors';
import { getSortAndFilterModel } from '../../helpers/filters';

import Icon from '../../components/Icon';
import shareData from '../../helpers/shareData';

import getLocaleDate from '../../helpers/getLocaleDate';

import env from '../../config';

import Global from '../../components/global';

const {
  getIcon,
  iconLibraries: { materialIcons, fontAwesome },
} = Icon;

const iconProps = {
  size: 22,
  color: colors.lightIcon,
};

export class EventsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('events.title'),
    };
  };

  state = {
    user: {},

    filteredEvents: [],
    checkList: '',

    dataSource: {
      isLoading: true,
      events: [],
    },
    location: {
      longitude: 0,
      latitude: 0,
    },

    bookmarks: [],
  };

  determineLocation() {
    setTimeout(() => {
      Geolocation.getCurrentPosition(
        position => {
          if (position.coords && position.coords.latitude && position.coords.longitude) {
            this.setState({
              location: position.coords,
            });
          }
        },
        error => {},
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 10000,
        }
      );
    }, 500);
  }

  getBookmarks = () => {
    if (Boolean(Global.user && Global.user.token && Global.user.token.length > 5)) {
      let requests = [axiosInstance(apiUrls.getBookmarks)];

      Promise.all(requests).then(([bookmarks]) => {
        // console.log('bookmarks', bookmarks.data)

        this.setState({
          bookmarks: bookmarks.data,
        });
      });
    }
  };

  toggleBookmark = (id, isBookmarked) => {
    // console.log('id', id, isBookmarked )

    if (id == undefined) return false;

    const { bookmarks } = this.state;

    const params = {
      Id: id,
      Entity: 'event',
    };

    if (isBookmarked) {
      axiosInstance.post(apiUrls.postRemoveBookmark, params).then(() => {
        Global.loadFavorites();

        this.getBookmarks();
      });
    } else {
      axiosInstance.post(apiUrls.postAddBookmark, params).then(data => {
        Global.loadFavorites();

        this.getBookmarks();
      });
    }
  };

  async componentDidMount() {
    // THIS IS BLOCKED BY console.reportErrorsAsExceptions = false; at APP
    // console.error(' ************************************************************* Testing error boundary');

    this.determineLocation();

    const { clearFiltersAndSorting } = this.props;
    clearFiltersAndSorting();

    const storedValue = await AsyncStorage.getItem('app:user');

    if (storedValue) {
      this.setState({
        user: JSON.parse(storedValue),
      });
    }

    this.getBookmarks();

    this._getHomeItems();
  }

  _getHomeItems() {
    const { sortOptions, filterOptions } = this.props;

    let model = getSortAndFilterModel(sortOptions, filterOptions);
    model.languageCode = i18n.locale.toUpperCase();
    model.langCode = i18n.locale.toUpperCase();

    if (this.props.filterOptions.distance) {
      model.distance = +this.props.filterOptions.distance;
    }

    if (this.state.location.longitude && this.state.location.latitude) {
      model = {
        ...model,
        ...this.state.location,
      };
    }

    // console.log('model DidMount', model);

    axiosInstance
      .post(apiUrls.postEvents, model)
      .then(({ data }) => {
        if (data.Items) {
          this.setState(
            {
              dataSource: { events: data.Items, isLoading: false },
            },
            () => {
              this.filterData();
            }
          );
        }
      })
      .catch(e => console.log(e));
  }

  componentDidUpdate(prevProps) {
    const { sortOptions, filterOptions } = this.props;

    if (
      !isEqual(sortOptions, prevProps.sortOptions) ||
      !isEqual(filterOptions, prevProps.filterOptions)
    ) {
      this.fetchItemsWithParams(sortOptions, filterOptions);
    }
  }

  fetchItemsWithParams = async (sortParams, filterParams) => {
    let model = getSortAndFilterModel(sortParams, filterParams);

    model.languageCode = i18n.locale.toUpperCase();
    model.langCode = i18n.locale.toUpperCase();

    if (this.props.filterOptions.distance) {
      model.distance = +this.props.filterOptions.distance;
    }

    if (this.state.location.longitude && this.state.location.latitude) {
      model = {
        ...model,
        ...this.state.location,
      };
    }

    console.log('model DidUpdate', model);

    axiosInstance
      .post(apiUrls.postEvents, model)
      .then(({ data }) => {
        if (data.Items) {
          this.setState(
            {
              dataSource: { events: data.Items, isLoading: false },
            },
            () => {
              this.filterData();
            }
          );
        }
      })
      .catch(err => console.log(err));
  };

  _getDate = (item, flag) => {
    let date = getLocaleDate(item);
    return date ? (
      <Text
        style={{
          color: '#fff',
          fontSize: 12,
          fontFamily: fontFamily.gothamMedium,
          // marginLeft: 5,
          marginLeft: i18n.locale.toLowerCase() == 'en' ? 5 : 0,
          marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 5,
          marginTop: 3,
          lineHeight: 20,
          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
          textTransform: 'uppercase',
        }}
      >
        {flag && '-  '}
        {date}
      </Text>
    ) : null;
  };

  _renderItemEvent = ({ item }) => {
    const { bookmarks } = this.state;

    let startEventDate = null;
    let endEventDate = null;

    if (item.EventStartDateTime) {
      startEventDate = item.EventStartDateTime;
    }

    if (item.EventEndDateTime) {
      endEventDate = item.EventEndDateTime;
    }

    let eventVenue = 'Dubai';
    if (item.VenueName) {
      eventVenue = item.VenueName;
    }

    const messageToShare = externalLinks.getEventsUrl(item.Id);

    const tagText = item.IsFree ? 'Free' : `${item.Currency} ${item.MinPrice}+`;

    const isBookmarked = Boolean(bookmarks.length)
      ? bookmarks.find(el => el.EntityName.toLowerCase() === 'event' && el.Eid === item.Id)
      : false;

    // console.log(item.Id, isBookmarked)
    // console.log(item)

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('EventDetail', {
            id: item.Id,
            object: item,
            getBookmarks: () => this.getBookmarks(),
          });
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            borderRadius: 5,
            overflow: 'hidden',
            marginBottom: 8,
          }}
        >
          <View
            style={{
              // borderWidth: 1,
              // borderColor: "#ff0000",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              overflow: 'hidden',
              backgroundColor: colors.secondaryBackgroundLight,
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,

                // borderWidth: 1,
                // borderColor: "#ff0000",

                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,

                overflow: 'hidden',

                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <DXBLogo height={50} width={80} />
            </View>
            <ImageBackground
              source={{ uri: item.ImageSquareThumbURL }}
              fadeDuration={0}
              style={{
                flex: 5,
                height: 190,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                overflow: 'hidden',
              }}
              resizeMode="cover"
            >
              {startEventDate && (
                <View
                  // onLayout={event => console.log(event.nativeEvent.layout.height)}
                  style={{
                    position: 'absolute',
                    left: i18n.locale.toLowerCase() == 'en' ? 0 : 'auto',
                    right: i18n.locale.toLowerCase() == 'en' ? 'auto' : 0,
                    bottom: 0,
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                    // backgroundColor: '#00ac9f',
                    // paddingHorizontal: 12,
                    // paddingVertical: 8,
                    // alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                      backgroundColor: '#00ac9f',
                      // paddingLeft: i18n.locale.toLowerCase() == 'en' ? 12 : 6,
                      // paddingRight: i18n.locale.toLowerCase() == 'en' ? 6 : 12,
                      paddingLeft: 10,
                      paddingRight: 4,
                      paddingVertical: 2,
                      alignItems: 'center',
                      height: 32,
                    }}
                  >
                    <EvilIcons name="calendar" size={20} color="#fff" />
                    {this._getDate(startEventDate)}
                    {endEventDate && this._getDate(endEventDate, true)}
                  </View>
                  <View
                    style={{
                      width: 0,
                      height: 0,
                      backgroundColor: 'transparent',
                      borderStyle: 'solid',
                      borderWidth: 0,
                      borderColor: 'transparent',

                      borderRightWidth: i18n.locale.toLowerCase() == 'en' ? 32 : 0,
                      borderLeftWidth: i18n.locale.toLowerCase() == 'en' ? 0 : 32,
                      borderBottomWidth: 32,
                      borderBottomColor: '#00ac9f',
                    }}
                  />
                </View>
              )}

              {/*item.MinPrice !== null && item.MinPrice !== 0 && !item.IsFree && (
              <View
                // onLayout={event => console.log(event.nativeEvent.layout.height)}
                style={{
                  position: 'absolute',
                  right: i18n.locale.toLowerCase() == 'en' ? 0 : 'auto',
                  left: i18n.locale.toLowerCase() == 'en' ? 'auto' : 0,
                  bottom: 0,
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                }}
              >
                <View
                  style={{
                    width: 0,
                    height: 0,
                    backgroundColor: 'transparent',
                    borderStyle: 'solid',
                    borderWidth: 0,
                    borderColor: 'transparent',

                    borderRightWidth: i18n.locale.toLowerCase() == 'en' ? 0 : 32,
                    borderLeftWidth: i18n.locale.toLowerCase() == 'en' ? 32 : 0,
                    borderBottomWidth: 32,
                    borderBottomColor: '#00ac9f',
                  }}
                />
                <View
                  style={{
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                    backgroundColor: '#00ac9f',
                    // paddingLeft: i18n.locale.toLowerCase() == 'en' ? 12 : 6, 
                    // paddingRight: i18n.locale.toLowerCase() == 'en' ? 6 : 12, 
                    paddingLeft: 4,
                    paddingRight: 10, 
                    paddingVertical: 2,
                    alignItems: 'center',
                    height: 32,
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: fontFamily.gothamMedium,
                      textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                    }}
                  >
                    {tagText}
                  </Text>
                </View>
              </View>
            )*/}
            </ImageBackground>
          </View>

          <View
            style={{
              flex: 2,
              backgroundColor: '#fff',
              paddingVertical: 10,
              paddingHorizontal: 15,
              paddingBottom: 14,
            }}
          >
            <View
              style={{
                flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                style={{
                  fontSize: 18,
                  fontFamily: fontFamily.gothamMedium,
                  lineHeight: 30,
                  color: '#00ac9f',
                  flexBasis: 'auto',
                  flexGrow: 0,
                  flexShrink: 1,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
              >
                {item.Title}
              </Text>
              <View
                style={{
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                  flexGrow: 0,
                  flexShrink: 0,
                  flexBasis: 'auto',
                  marginTop: 3,
                }}
              >
                <TouchableOpacity
                  onPress={() => shareData(messageToShare)}
                  style={{
                    ...(i18n.locale.toLowerCase() == 'en'
                      ? {
                          marginLeft: 5,
                          marginRight: Boolean(
                            Global.user && Global.user.token && Global.user.token.length > 5
                          )
                            ? 12
                            : 0,
                        }
                      : {
                          marginRight: 5,
                          marginLeft: Boolean(
                            Global.user && Global.user.token && Global.user.token.length > 5
                          )
                            ? 12
                            : 0,
                        }),
                  }}
                >
                  {getIcon(materialIcons, 'share', iconProps)}
                </TouchableOpacity>
                {Boolean(Global.user && Global.user.token && Global.user.token.length > 5) && (
                  <TouchableOpacity
                    onPress={() => this.toggleBookmark(item.Id, Boolean(isBookmarked))}
                  >
                    {getIcon(fontAwesome, Boolean(isBookmarked) ? 'star' : 'star-o', iconProps)}
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View
              style={{
                alignItems: 'center',
                flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
              }}
            >
              <EvilIcons
                name="location"
                size={18}
                color="grey"
                style={{
                  marginRight: i18n.locale.toLowerCase() == 'en' ? 5 : 0,
                  marginLeft: i18n.locale.toLowerCase() == 'en' ? 0 : 5,
                }}
              />
              <Text
                style={{
                  color: 'grey',
                  fontSize: 14,
                  fontFamily: fontFamily.gothamMedium,
                  marginTop: 5,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
              >
                {eventVenue}
              </Text>
            </View>

            {item.MinPrice !== null && item.MinPrice !== 0 && !item.IsFree ? (
              <View
                style={{
                  marginTop: 10,
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',

                  alignItems: 'center',

                  borderRadius: 5,
                  overflow: 'hidden',

                  borderColor: colors.themeColor,
                  borderWidth: 2,
                  height: 38,
                }}
              >
                <View
                  style={{
                    width: '50%',
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                    height: 34,
                    paddingRight: 25,
                    // borderColor: '#ff0000',
                    // borderWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      height: 34,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    activeOpacity={1}
                    onPress={() => {}}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: fontFamily.gothamBold,
                        color: colors.themeColor,
                        lineHeight: 30,
                        textTransform: 'uppercase',
                        textAlign: 'center',
                      }}
                    >
                      {tagText}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    width: '50%',
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                    height: 34,
                    paddingLeft: 25,

                    // borderColor: '#ff0000',
                    // borderWidth: 1,
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: -25,
                      // right: i18n.locale.toLowerCase() == 'en' ? 0 : -25,

                      width: 0,
                      height: 0,
                      backgroundColor: 'transparent',
                      borderStyle: 'solid',
                      borderWidth: 0,
                      borderColor: 'transparent',

                      borderRightWidth: i18n.locale.toLowerCase() == 'en' ? 0 : 50,
                      borderLeftWidth: i18n.locale.toLowerCase() == 'en' ? 50 : 0,
                      borderBottomWidth: 34,
                      borderBottomColor: colors.themeColor,
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      flex: 1,
                    }}
                    activeOpacity={1}
                    onPress={() => {
                      this.props.navigation.navigate('EventDetail', {
                        id: item.Id,
                        object: item,
                        getBookmarks: () => this.getBookmarks(),
                      });
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        height: 34,

                        backgroundColor: colors.themeColor,

                        alignItems: 'center',
                        justifyContent: 'center',

                        paddingRight: i18n.locale.toLowerCase() == 'en' ? 5 : 0,
                        paddingLeft: i18n.locale.toLowerCase() == 'en' ? 0 : 5,

                        // borderColor: colors.themeColor,
                        // flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: fontFamily.gothamBold,
                          color: '#ffffff',
                          lineHeight: 30,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                        }}
                      >
                        {i18n.t('events.buy_now_list')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  marginTop: 10,
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row-reverse' : 'row',
                  height: 38,
                }}
              >
                <View
                  style={{
                    width: '50%',
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                    height: 38,
                    paddingLeft: 25,
                    // paddingLeft: i18n.locale.toLowerCase() == 'en' ? 25 : 0,
                    // paddingRight: i18n.locale.toLowerCase() == 'en' ? 0 : 25,
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: -25,
                      // right: i18n.locale.toLowerCase() == 'en' ? 0 : -25,

                      width: 0,
                      height: 0,
                      backgroundColor: 'transparent',
                      borderStyle: 'solid',
                      borderWidth: 0,
                      borderColor: 'transparent',

                      borderRightWidth: i18n.locale.toLowerCase() == 'en' ? 0 : 50,
                      borderLeftWidth: i18n.locale.toLowerCase() == 'en' ? 50 : 0,
                      borderBottomWidth: 38,
                      borderBottomColor: colors.themeColor,
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      flex: 1,
                    }}
                    activeOpacity={1}
                    onPress={() => {
                      this.props.navigation.navigate('EventDetail', {
                        id: item.Id,
                        object: item,
                        getBookmarks: () => this.getBookmarks(),
                      });
                    }}
                  >
                    <View
                      style={{
                        flex: 1,

                        height: 38,

                        borderTopRightRadius: i18n.locale.toLowerCase() == 'en' ? 5 : 0,
                        borderBottomRightRadius: i18n.locale.toLowerCase() == 'en' ? 5 : 0,

                        borderTopLeftRadius: i18n.locale.toLowerCase() == 'en' ? 0 : 5,
                        borderBottomLeftRadius: i18n.locale.toLowerCase() == 'en' ? 0 : 5,

                        backgroundColor: colors.themeColor,

                        alignItems: 'center',
                        justifyContent: 'center',

                        paddingRight: i18n.locale.toLowerCase() == 'en' ? 5 : 0,
                        paddingLeft: i18n.locale.toLowerCase() == 'en' ? 0 : 5,

                        // borderColor: colors.themeColor,
                        // flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: fontFamily.gothamBold,
                          color: '#ffffff',
                          lineHeight: 30,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                        }}
                      >
                        {i18n.t('events.read_more_list')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _listDividerEvent = () => <View style={styles.dividerContainerEvent} />;

  filterData() {
    const { dataSource, checkList } = this.state;

    let filteredEvents = dataSource.events.filter(event => {
      let str = checkList ? checkList.toLowerCase() : '';
      let title = event.Title ? event.Title.toLowerCase() : '';
      let venue = event.VenueName ? event.VenueName.toLowerCase() : '';

      return title.indexOf(str) >= 0 || venue.indexOf(str) >= 0;
    });

    this.setState({
      filteredEvents,
    });
  }

  render() {
    const { checkList, filteredEvents, bookmarks } = this.state;
    const { navigation } = this.props;

    if (this.state.dataSource.isLoading) {
      return <Loading />;
    }

    // console.log('bookmarks', bookmarks )

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              flex: 1,
              paddingBottom: 20,
            }}
          >
            <FilterAndSearchBar
              filterTargetScreen="EventsFilterScreen"
              //sortTargetScreen="EventsSortScreen"
            />

            <TextInput
              placeholder={i18n.t('events.searchField')}
              placeholderTextColor="#8C9091"
              returnKeyType="go"
              style={{
                ...styles.searchFieldList,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
              }}
              onChange={e => {
                let checkList = e && e.nativeEvent && e.nativeEvent.text ? e.nativeEvent.text : '';
                this.setState(
                  {
                    checkList,
                  },
                  () => {
                    this.filterData();
                  }
                );
              }}
              value={checkList}
            />

            <FlatList
              extraData={this.state}
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              data={filteredEvents}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this._listDividerEvent}
              renderItem={this._renderItemEvent}
              initialNumToRender={15}
            />

            {filteredEvents.length === 0 && (
              <Text
                style={{
                  marginTop: 150,
                  textAlign: 'center',
                  marginBottom: 5,
                  color: '#9E9E9B',
                  fontSize: 24,
                  fontFamily: fontFamily.gothamBold,
                }}
              >
                {i18n.t('events.no_events_in_selected_categories')}
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  filterOptions: state.events.filters,
  sortOptions: state.events.sortOptions,
});

const mapDispatchToProps = {
  clearFiltersAndSorting: actions.clearEventsData,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsScreen);
