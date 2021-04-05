import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';

import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';

import Geolocation from '@react-native-community/geolocation';

import AsyncStorage from '@react-native-community/async-storage';

import moment from 'moment';

import { externalLinks, axiosInstance, apiUrls } from '../../constants/api';
import { NavHeaderUser } from '../../components/NavHeaderUser';
import FilterAndSearchBar from '../../components/FilterAndSearchBar';
import Loading from '../../components/Loading';

import i18n from '../../../i18n';
import { fontFamily, fontSize } from '../../constants/fonts';
import colors from '../../constants/colors';

import styles from './styles';
import * as actions from '../BookingsScreen/actions';
import Icon from '../../components/Icon';
import { getSortAndFilterModel } from '../../helpers/filters';
import Global from '../../components/global';
import FA5Icons from 'react-native-vector-icons/FontAwesome5';

import shareData from '../../helpers/shareData';

import getLocaleDate from '../../helpers/getLocaleDate';

import env from '../../config';

class BookingsListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('bookingsLanding.title'),
    };
  };

  state = {
    cache: Date.now(),
    user: {},

    filteredBooking: [],
    checkList: '',

    dataSource: {
      isLoading: true,
      booking: [],
    },

    searchForm: {},

    location: {
      longitude: 0,
      latitude: 0,
    },

    bookmarks: [],
  };

  constructor(props) {
    super(props);
  }

  filterData() {
    const { dataSource, checkList } = this.state;

    let filteredBooking = dataSource.booking.filter(booking => {
      let str = checkList ? checkList.toLowerCase() : '';

      let title = booking.OfferTitle ? booking.OfferTitle.toLowerCase() : '';
      let locationName = booking.LocationName ? booking.LocationName.toLowerCase() : '';
      let venue = booking.VenueTitle ? booking.VenueTitle.toLowerCase() : '';
      let facility = booking.FacilityTitle ? booking.FacilityTitle.toLowerCase() : '';

      return (
        title.indexOf(str) >= 0 ||
        locationName.indexOf(str) >= 0 ||
        venue.indexOf(str) >= 0 ||
        facility.indexOf(str) >= 0
      );
    });

    this.setState({
      filteredBooking,
    });
  }

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
        this.setState({
          bookmarks: bookmarks.data,
        });
      });
    }
  };

  async componentDidMount() {
    // const { sortOptions, filterOptions } = this.props;

    // console.log('sortOptions', sortOptions)
    // console.log('filterOptions', filterOptions)

    const { searchForm } = this.state;

    this.determineLocation();

    // const { clearFiltersAndSorting } = this.props;
    // clearFiltersAndSorting();

    const storedValue = await AsyncStorage.getItem('app:user');

    if (storedValue) {
      this.setState({
        user: JSON.parse(storedValue),
      });
    }

    // this.focusListener = this.props.navigation.addListener('willFocus', () => {
    // this.setState({
    // refreshList: !this.state.refreshList,
    // });
    // });

    this.getBookmarks();

    this.setState(
      {
        searchForm: this.props.navigation.getParam('form', {}),
      },
      () => {
        // console.log('searchForm', searchForm)
        this._getHomeItems();
      }
    );
  }

  // componentWillUnmount() {
  // this.focusListener.remove();
  // }

  componentDidUpdate(prevProps) {
    const { sortOptions, filterOptions } = this.props;
    const { searchForm } = this.state;

    // console.log('sortOptions', sortOptions);
    // console.log('filterOptions', filterOptions);

    const { navigation } = this.props;

    if (!isEqual(navigation, prevProps.navigation)) {
      this.setState(
        {
          cache: Date.now(),
          searchForm: this.props.navigation.getParam('form', {}),
        },
        () => {
          this._getHomeItems();
        }
      );
    }

    if (
      !isEqual(sortOptions, prevProps.sortOptions) ||
      !isEqual(filterOptions, prevProps.filterOptions)
    ) {
      this.setState(
        {
          searchForm: this.props.navigation.getParam('form', {}),
        },
        () => {
          // console.log('searchForm', searchForm)
          this.fetchItemsWithParams(sortOptions, filterOptions);
        }
      );
    }
  }

  _getHomeItems() {
    // let booking = [];

    // if (loadingStep != null && loadingStep >= 0 && loadingStep <= 2) {
    // booking = this.state.dataSource.booking;
    // }

    // this.setState({
    // dataSource: { booking: booking, isLoading: true },
    // });

    // if (this.state.searchForm.isBookingsHomeForm) {
    // if (!loadingStep || loadingStep < 0) {
    // loadingStep = 0;
    // }
    // }

    // let headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    // if (this.state.user.token && this.state.user.token.length > 4) {
    // headers['auth-token'] = this.state.user.token;
    // }

    // let sortDirection = 'ASC';
    // if (!this.state.sortOrder) {
    // sortDirection = 'DESC';
    // }
    // if (loadingStep === 2) {
    // sortDirection = 'DESC';
    // }
    // if (loadingStep === 1) {
    // sortDirection = 'ASC';
    // }

    // let requestURL = `${env.api}api/bookandplay?sortDirection=${sortDirection}`;
    // if (categories.length > 0) {
    // requestURL += `&srCat=${categories}`;
    // }

    // if (
    // this.state.searchForm.categoryOfSports &&
    // this.state.searchForm.categoryOfSports.length > 0
    // ) {
    // requestURL += `&sp=${this.state.searchForm.categoryOfSports.join(',')}`;
    // }

    // if (this.state.searchForm.activityType.length > 0) {
    // let activityType = 0;
    // for (let o of this.state.searchForm.activityType) {
    // activityType += o;
    // }

    // requestURL += `&sat=${activityType}`;
    // }

    // if (loadingStep === 1) {
    // requestURL += `&from=${moment().add(1, 'days').format('YYYY-MM-DD')}`;
    // requestURL += `&to=${moment().add(999, 'years').format('YYYY-MM-DD')}`;
    // }

    // if (loadingStep === 2) {
    // requestURL += `&from=${moment().subtract(999, 'years').format('YYYY-MM-DD')}`;
    // requestURL += `&to=${moment().subtract(1, 'days').format('YYYY-MM-DD')}`;
    // }

    // if (this.state.searchForm.startDate.length > 0) {
    // if (this.state.searchForm.startDate[0] === 0) {
    // }

    // if (this.state.searchForm.startDate[0] === 1) {
    // requestURL += `&from=${moment().format('YYYY-MM-DD')}`;
    // requestURL += `&to=${moment().format('YYYY-MM-DD')}`;
    // }

    // if (this.state.searchForm.startDate[0] === 2) {
    // requestURL += `&from=${moment().add(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD')}`;
    // requestURL += `&to=${moment().add(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD')}`;
    // }
    // if (this.state.searchForm.startDate[0] === 3) {
    // requestURL += `&from=${moment().add(1, 'month').startOf('month').format('YYYY-MM-DD')}`;
    // requestURL += `&to=${moment().add(1, 'month').endOf('month').format('YYYY-MM-DD')}`;
    // }
    // if (this.state.searchForm.startDate[0] === 4) {
    // requestURL += `&from=${moment().add(1, 'year').startOf('year').format('YYYY-MM-DD')}`;
    // requestURL += `&to=${moment().add(1, 'year').endOf('year').format('YYYY-MM-DD')}`;
    // }
    // }

    const { sortOptions, filterOptions } = this.props;
    const { searchForm } = this.state;

    // console.log('Book and Play sortOptions', sortOptions)
    // console.log('Book and Play filterOptions', filterOptions)

    // let model = getSortAndFilterModel(sortOptions, filterOptions);

    // model.languageCode = i18n.locale.toUpperCase();
    // model.langCode = i18n.locale.toUpperCase();
    // model.distance = this.props.filterOptions.distance;

    // if (this.state.location.longitude && this.state.location.latitude) {
    // model = {
    // ...model,
    // ...this.state.location,
    // };
    // }

    // console.log('Book and Play model DidMount', model);
    // console.log('Book and Play URL', requestURL + '&langCode=' + i18n.locale.toUpperCase());

    // console.log('searchForm', searchForm)

    let params = {};

    params.languageCode = i18n.locale.toUpperCase();

    if (this.props.filterOptions.distance) {
      params.distance = +this.props.filterOptions.distance;
    }

    if (this.state.location.longitude && this.state.location.latitude) {
      params = {
        ...params,
        ...this.state.location,
      };
    }

    if (filterOptions.dateRange && filterOptions.dateRange.length == 0) {
      params.from = moment().format('YYYY-MM-DD');
    } else {
      filterOptions.dateRange[0] && (params.from = filterOptions.dateRange[0]);
      filterOptions.dateRange[1] && (params.to = filterOptions.dateRange[1]);
    }

    sortOptions.date && (params.sortDirection = sortOptions.date == 1 ? 'ASC' : 'DESC');

    filterOptions.categoryOfSports &&
      filterOptions.categoryOfSports.length > 0 &&
      (params.sp = filterOptions.categoryOfSports.join(','));

    // console.log('SAT', searchForm.activityType.reduce((a, b) => a + b, 0))

    if (
      searchForm.isBookingsHomeForm &&
      searchForm.activityType &&
      searchForm.activityType.length > 0
    ) {
      params = {
        ...params,
        sat: searchForm.activityType.reduce((a, b) => a + b, 0),
      };
    } else {
      filterOptions.eventType &&
        filterOptions.eventType.length > 0 &&
        (params.sat = filterOptions.eventType.reduce((a, b) => a + b, 0));
    }

    // console.log('Book and Play PARAMS', params);
    // console.log('apiUrls.getBookAndPlay', apiUrls.getBookAndPlay);

    axiosInstance
      .get(apiUrls.getBookAndPlay, { params })
      .then(({ data }) => {
        // console.log('Book and Play data.Items', data.Items);

        if (data.Items) {
          this.setState(
            {
              dataSource: { booking: data.Items, isLoading: false },
            },
            () => {
              this.filterData();
            }
          );
        }
      })
      .catch(err => console.log(err));
  }

  fetchItemsWithParams = async (sortParams, filterParams) => {
    this._getHomeItems();
  };

  toggleBookmark = (id, isBookmarked, entityType) => {
    console.log('id', id, isBookmarked, entityType);

    if (id == undefined) return false;

    const { bookmarks } = this.state;

    const params = {
      Id: id,
      Entity: entityType,
    };

    console.log(params);

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

  getDate = item => {
    const { getIcon, iconLibraries } = Icon;

    const iconProps = {
      size: 20,
      color: colors.lightIcon,
    };

    let date = getLocaleDate(item);
    return date ? (
      <View
        style={{
          flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
          justifyContent: 'flex-start',
        }}
      >
        {getIcon(iconLibraries.fontAwesome5, 'calendar-alt', {
          size: fontSize.medium,
          color: '#575756',
        })}
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            color: colors.textBasic,
            fontSize: fontSize.regular,
            lineHeight: fontSize.regular + 8,
            marginLeft: i18n.locale.toLowerCase() == 'en' ? 8 : 0,
            marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 8,
            fontFamily: fontFamily.gothamMedium,
            textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
          }}
        >
          {date}
        </Text>
      </View>
    ) : null;
  };

  renderPrice(price, currency) {
    // console.log(price, currency);
    if (price == undefined || currency == undefined) return null;
    return (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: 0,
          right: 0,
          justifyContent: 'flex-end',
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

            borderLeftWidth: 22,
            borderTopWidth: 22,
            borderTopColor: colors.themeColor,
          }}
        />
        <View
          style={{
            backgroundColor: colors.themeColor,
            minHeight: 22,
            minWidth: 95,
            paddingLeft: 10,
            paddingRight: 18,
            alignItems: 'flex-end',
            justifyContent: 'center',

            borderWidth: 0,
            borderColor: 'transparent',
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.gothamBold,
              fontSize: 12,
              color: colors.basicLightText,
              lineHeight: 22,
              textAlign: 'center',
            }}
          >
            {price > 0 ? `${currency} ${price}` : 'FREE'}
          </Text>
        </View>
      </View>
    );
  }

  renderTypeName(type) {
    if (type == undefined) return null;

    let entityType = i18n.t('socialSportsActivity.type_event');
    let entityColor = '#00a39c';
    let textColor = colors.basicLightText;

    if ([8].includes(type)) {
      entityType = i18n.t('socialSportsActivity.type_match');
      entityColor = '#d3b000';
      textColor = colors.themeColor;
    }
    if ([1, 16, 32, 64].includes(type)) {
      entityType = i18n.t('socialSportsActivity.type_activity');
      entityColor = '#78bc4b';
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: 0,
          left: 0,
          justifyContent: 'flex-start',
        }}
      >
        <View
          style={{
            backgroundColor: entityColor,
            minHeight: 22,
            minWidth: 155,
            paddingLeft: 18,
            paddingRight: 10,
            alignItems: 'flex-start',
            justifyContent: 'center',

            borderWidth: 0,
            borderColor: 'transparent',
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.gothamMedium,
              fontSize: 12,
              color: textColor,
              lineHeight: 22,
              textAlign: 'center',
            }}
          >
            {entityType}
          </Text>
        </View>
        <View
          style={{
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderWidth: 0,
            borderColor: 'transparent',

            borderRightWidth: 22,
            borderTopWidth: 22,
            borderTopColor: entityColor,
          }}
        />
      </View>
    );
  }

  _renderItemEvent = ({ item, index }) => {
    const { isSignedInUser, bookmarks } = this.state;
    const { getIcon, iconLibraries } = Icon;

    const iconProps = {
      size: 20,
      color: colors.lightIcon,
    };

    let messageToShare = '';
    let entityType = 'event';

    if ([8].includes(item.SportActivityType)) {
      //entityType = 'event';
      entityType = 'ssaEvent';
      messageToShare = externalLinks.getMatchesUrl(item.OfferId);
    } // SSA
    if ([128, 2, 4].includes(item.SportActivityType)) {
      entityType = 'event';
      messageToShare = externalLinks.getEventsUrl(item.OfferId);
    }
    if ([1, 16, 32, 64].includes(item.SportActivityType)) {
      entityType = 'package';
      messageToShare = externalLinks.getPackagesUrl(item.OfferId);
    }

    if (item.DateTimeInfo) {
      const dateTime = item.DateTimeInfo.split(' - ');
      if (dateTime.length === 2) {
        item.DateTimeInfo = dateTime[0];
      }
    }

    const isBookmarked = Boolean(bookmarks.length)
      ? // ? bookmarks.find(el => el.EntityName.toLowerCase() === entityType && el.Eid === item.OfferId)
        bookmarks.find(el => el.Eid === item.OfferId)
      : false;

    // console.log(item)

    // console.log('item.DateTimeInfo',item.DateTime )
    // console.log('item.DateTimeInfo', moment(item.DateTimeInfo).format('DD MM YYYY') )
    // console.log('item.DateTimeInfo', new Date(item.DateTimeInfo) )
    // console.log('messageToShare', messageToShare)
    // console.log('SportActivityType', item.SportActivityType);

    return (
      <TouchableOpacity
        onPress={() => {
          // console.log('SportActivityType', item.SportActivityType);

          if ([8].includes(item.SportActivityType)) {
            this.props.navigation.navigate('SsaEventDetailsScreen', {
              params: {
                id: item.OfferId,
              },
              getBookmarks: () => this.getBookmarks(),
            });
          }
          if ([128, 2, 4].includes(item.SportActivityType)) {
            this.props.navigation.navigate('EventDetail', {
              id: item.OfferId,
              object: {},
              getBookmarks: () => this.getBookmarks(),
            });
          }
          if ([1, 16, 32, 64].includes(item.SportActivityType)) {
            this.props.navigation.navigate('PackageDetails', {
              id: item.OfferId,
              item: item,
              getBookmarks: () => this.getBookmarks(),
            });
          }
        }}
      >
        <View
          style={{
            backgroundColor: colors.backgroundLight,
            borderRadius: 10,
            marginBottom: 8,
            flexDirection: 'row',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              overflow: 'hidden',
              width: 128,
              // borderColor: "#ff0000",
              // borderWidth: 1,
              // justifyContent: 'center',
              // alignItems: 'stretch',
            }}
          >
            <Image
              style={{
                flex: 1,
                // width: 128,
                // height: '100%',
                // height: 25,
                // alignSelf: "stretch",
                // borderColor: "#ff0000",
                // borderWidth: 1,
                // justifyContent: "flex-start",
                // alignItems: "center",
              }}
              resizeMode="cover"
              source={{ uri: item.ImageUrl }}
            />

            {this.renderPrice(item.Price, item.Currency)}
          </View>

          <View
            style={{
              paddingLeft: 18,
              paddingRight: 16,
              paddingBottom: 11,
              paddingTop: item.SportActivityType == undefined ? 11 : 33,
              flex: 1,
            }}
          >
            {this.renderTypeName(item.SportActivityType)}

            <View
              style={{
                flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                justifyContent: 'space-between',
                marginBottom: 9,
              }}
            >
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                adjustsFontSizeToFit
                style={{
                  // color: '#00A39C',
                  // color: colors.textBasic,
                  color: colors.basicText,
                  fontSize: 14,
                  fontFamily: fontFamily.gothamBold,
                  flexBasis: 'auto',
                  flexGrow: 0,
                  flexShrink: 1,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                }}
              >
                {item.OfferTitle}
              </Text>

              <View
                style={{
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                  flexGrow: 0,
                  flexShrink: 0,
                  flexBasis: 'auto',
                }}
              >
                <TouchableOpacity
                  onPress={() => shareData(messageToShare)}
                  style={{
                    marginLeft: 5,
                    marginRight:
                      Global.user && Global.user.token && Global.user.token.length > 5 ? 12 : 0,
                  }}
                >
                  {getIcon(iconLibraries.materialIcons, 'share', iconProps)}
                </TouchableOpacity>
                {Boolean(Global.user && Global.user.token && Global.user.token.length > 5) && (
                  <TouchableOpacity
                    onPress={() => {
                      console.log('SportActivityType', item.SportActivityType);
                      this.toggleBookmark(item.OfferId, Boolean(isBookmarked), entityType);
                    }}
                  >
                    {getIcon(
                      iconLibraries.fontAwesome,
                      Boolean(isBookmarked) ? 'star' : 'star-o',
                      iconProps
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                justifyContent: 'flex-start',
                marginBottom: 9,
              }}
            >
              {getIcon(iconLibraries.fontAwesome5, 'map-marker-alt', {
                size: fontSize.medium,
                color: '#575756',
              })}
              <Text
                ellipsizeMode="tail"
                numberOfLines={2}
                style={{
                  color: colors.textBasic,
                  fontSize: fontSize.regular,
                  fontFamily: fontFamily.gothamMedium,
                  lineHeight: fontSize.regular + 8,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                  marginLeft: i18n.locale.toLowerCase() == 'en' ? 8 : 0,
                  marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 8,
                }}
              >
                {item.VenueTitle}
              </Text>
            </View>

            <Text
              ellipsizeMode="tail"
              numberOfLines={2}
              style={{
                color: colors.textBasic,
                fontSize: fontSize.regular,
                fontFamily: fontFamily.gothamMedium,
                lineHeight: fontSize.regular + 8,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                marginBottom: 10,
              }}
            >
              {item.FacilityTitle}
            </Text>

            {this.getDate(item.DateTime)}

            {/*
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 9 }}>
              {getIcon(iconLibraries.fontAwesome5, 'ticket-alt', {
                size: fontSize.medium,
                color: '#575756',
              })}
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{
                  color: colors.textBasic,
                  fontSize: fontSize.regular,
                  marginLeft: 6,
                  fontFamily: fontFamily.gothamMedium,
                }}
              >
                {item.Price > 0 &&
                  ![1, 16, 32, 64].includes(item.SportActivityType) &&
                  i18n.t('bookingsLanding.ticketed_event')}
                {item.Price <= 0 &&
                  ![1, 16, 32, 64].includes(item.SportActivityType) &&
                  i18n.t('bookingsLanding.free_event')}
                {[1, 16, 32, 64].includes(item.SportActivityType) &&
                  i18n.t('bookingsLanding.activity')}
              </Text>
            </View>
            <Text
              ellipsizeMode="tail"
              numberOfLines={2}
              style={{
                color: colors.textBasic,
                fontSize: fontSize.regular,
                fontFamily: fontFamily.gothamMedium,
                lineHeight: 19,
              }}
            >
              {item.Excerpt}
            </Text>
            */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _listDividerEvent = () => <View style={styles.dividerContainerEvent} />;

  render() {
    const { navigation } = this.props;
    const { checkList, filteredBooking, bookmarks } = this.state;

    if (this.state.dataSource.isLoading) {
      return <Loading />;
    }

    // console.log('bookmarks', bookmarks )
    // console.log('filteredBooking', filteredBooking )

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View
            style={{
              marginLeft: 15,
              marginRight: 15,
              flex: 1,
              paddingBottom: 50,
            }}
          >
            <FilterAndSearchBar
              filterTargetScreen="BookingsFilterScreen"
              //sortTargetScreen="BookingsSortScreen"
            />

            <TextInput
              placeholder={i18n.t('bookPlay.searchField')}
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

            {/*!this.state.isListView && (
              <FlatList
                horizontal={false}
                numColumns={2}
                showsHorizontalScrollIndicator={false}
                data={this.state.dataSource.booking}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this._listDividerRecommended}
                renderItem={this._renderItemRecommended}
              />
            )*/}

            {/*this.state.isListView && (
              <FlatList
                extraData={this.state.refreshList}
                horizontal={false}
                showsHorizontalScrollIndicator={false}
                data={this.state.dataSource.booking}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={this._listDividerEvent}
                renderItem={this._renderItemEvent}
              />
            )*/}

            <FlatList
              extraData={this.state}
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              data={filteredBooking}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this._listDividerEvent}
              renderItem={this._renderItemEvent}
              initialNumToRender={15}
            />

            {filteredBooking == 0 && (
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
                {i18n.t('bookingsLanding.no_bookings_in_selected_categories')}
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  filterOptions: state.bookings.filters,
  sortOptions: state.bookings.sortOptions,
});

const mapDispatchToProps = {
  updateStore: actions.setBookingsData,
  clearFiltersAndSorting: actions.clearBookingsData,
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingsListScreen);
