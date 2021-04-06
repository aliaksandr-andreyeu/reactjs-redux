import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  TextInput,
  Modal
} from 'react-native'

import isEqual from 'lodash.isequal'

import Loading from '../../components/Loading'

import AsyncStorage from '@react-native-community/async-storage'
import Moment from 'moment'
import FA5Icons from 'react-native-vector-icons/FontAwesome5'
import { externalLinks, axiosInstance, apiUrls } from '../../constants/api'
import { NavHeaderUser } from '../../components/NavHeaderUser'
import styles from './styles'

import FilterAndSearchBar from '../../components/FilterAndSearchBar'

import * as actions from './actions'

import i18n from '../../../i18n'

import { fontFamily } from '../../constants/fonts'
import colors from '../../constants/colors'
import { getSortAndFilterModel } from '../../helpers/filters'
import FullWidthImage from 'react-native-fullwidth-image'
import BookingsPromoImage from '../../assets/images/bookings_promo.png'
import SkewedContainer from '../../components/SkewedContainer'
import { EventType } from '../FilterScreens/EventsFilter/models'
import { sportActivityTypes } from '../../constants/socialSportsActivity'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import getLocaleDate from '../../helpers/getLocaleDate'

import env from '../../config'

import moment from 'moment'

export class HeaderSearchScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    let searchForm = navigation.getParam('searchForm', {})
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: searchForm.isBookmarked ? i18n.t('more.my_bookmarks') : i18n.t('headerSearch.title')
    }
  }

  state = {
    searchForm: {
      query: ''
    },
    isLoading: true,
    results: []
  }

  componentDidMount() {
    const { clearFiltersAndSorting, navigation } = this.props

    clearFiltersAndSorting()

    this.setState(
      {
        searchForm: navigation.getParam('searchForm', {})
      },
      () => {
        this.load()
      }
    )
  }

  componentDidUpdate(prevProps) {
    const { filterOptions } = this.props

    if (!isEqual(filterOptions, prevProps.filterOptions)) {
      this.load()
    }
  }

  load() {
    const { filterOptions } = this.props

    let requests = []

    let contentType = filterOptions.contentType ? `&srEntity=${filterOptions.contentType}` : ''

    if (this.state.searchForm.isHomeCategory) {
      // console.log(`${env.api}api/search?langCode=${i18n.locale.toUpperCase()}&srCat=${this.state.searchForm.id}&srStartDate=${moment().format('YYYY-MM-DD')}${contentType}`)

      requests.push(
        axiosInstance(
          `${env.api}api/search?langCode=${i18n.locale.toUpperCase()}&srCat=${
            this.state.searchForm.id
          }&srStartDate=${moment().format('YYYY-MM-DD')}${contentType}`
        )
      )
    }
    if (this.state.searchForm.isHeaderSearch) {
      // console.log(`${env.api}api/search?langCode=${i18n.locale.toUpperCase()}&srQuery=${this.state.searchForm.query}`)

      requests.push(
        axiosInstance(
          `${env.api}api/search?langCode=${i18n.locale.toUpperCase()}&srQuery=${
            this.state.searchForm.query
          }${contentType}`
        )
      )
    }

    if (this.state.searchForm.isBookmarked) {
      requests.push(axiosInstance(`${env.api}api/search?langCode=${i18n.locale.toUpperCase()}&srGetBookmarkedOnly=1`))
    }

    Promise.all(requests).then(([result]) => {
      // console.log("RESULT", result)
      this.setState({
        isLoading: false,
        results: result.data
      })
    })
  }

  renderTypeName(type) {
    if (type == undefined) return null

    let entityType = i18n.t('search.entity_event')
    let entityColor = '#00a39c'
    let textColor = colors.basicLightText

    if (type === 'News') {
      entityType = i18n.t('search.entity_news')
      entityColor = '#a38966'
    }

    if (type === 'Feature') {
      entityType = i18n.t('search.entity_feature')
      entityColor = '#a38966'
    }

    if (type === 'Venue') {
      entityType = i18n.t('search.entity_venue')
      entityColor = '#78bc4b'
    }

    if (type === 'Match') {
      entityType = i18n.t('search.entity_match')
      entityColor = '#d3b000'
      textColor = colors.themeColor
    }

    if (type === 'Activity') {
      entityType = i18n.t('search.entity_activity')
      entityColor = '#78bc4b'
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: 0,
          left: 0,
          justifyContent: 'flex-start'
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
            borderColor: 'transparent'
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.gothamMedium,
              fontSize: 12,
              color: textColor,
              lineHeight: 22,
              textAlign: 'center'
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
            borderTopColor: entityColor
          }}
        />
      </View>
    )
  }

  _getDate(item) {
    let date = getLocaleDate(item)
    return date ? (
      <View
        style={{
          flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
          alignItems: 'center',
          marginLeft: -2,
          marginBottom: 6
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
          }}
        >
          <EvilIcons
            name="calendar"
            size={18}
            style={{
              marginTop: -2,
              marginRight: i18n.locale.toLowerCase() == 'en' ? 4 : 0,
              marginLeft: i18n.locale.toLowerCase() == 'en' ? 0 : 4
            }}
          />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamily.gothamMedium
            }}
          >
            {date}
          </Text>
        </View>
      </View>
    ) : null
  }

  renderPrice(entity, price, currency) {
    // console.log(price, currency);
    if (price == undefined || currency == undefined) return null
    return entity === 'Event' || entity === 'Activity' || entity === 'Match' ? (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          top: 0,
          right: 0,
          justifyContent: 'flex-end'
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
            borderTopColor: colors.themeColor
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
            borderColor: 'transparent'
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.gothamBold,
              fontSize: 12,
              color: colors.basicLightText,
              lineHeight: 22,
              textAlign: 'center'
            }}
          >
            {price > 0 ? `${currency} ${price}` : 'FREE'}
          </Text>
        </View>
      </View>
    ) : null
  }

  render() {
    Moment.locale('en')
    const { navigation } = this.props

    if (this.state.isLoading) {
      return <Loading />
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 10 }}>
          <View
            style={{
              marginHorizontal: 15,
              marginBottom: 8
            }}
          >
            <FilterAndSearchBar filterTargetScreen="HeaderSearchFilterScreen" />
          </View>

          {this.state.results
            .filter(item => {
              // console.log('item:', item);
              // console.log( 'item.EntityName:', item.EntityName )

              return (
                item.EntityName === 'Event' ||
                item.EntityName === 'News' ||
                item.EntityName === 'Feature' ||
                item.EntityName === 'Venue' ||
                item.EntityName === 'Match' ||
                item.EntityName === 'Activity'
              )
            })
            .map((item, i) => {
              // if ( item.EntityName === 'Activity') {
              // console.log( 'item:', item )
              // }

              return (
                <TouchableOpacity
                  key={i}
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    marginHorizontal: 15,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    marginBottom: 10,
                    overflow: 'hidden',
                    height: 152
                  }}
                  onPress={() => {
                    switch (item.EntityName) {
                      case 'Activity':
                        return navigation.navigate('PackageDetails', { item: item, id: item.Eid })
                      case 'Match':
                        return navigation.navigate('SsaEventDetailsScreen', {
                          params: {
                            item: item,
                            id: item.Eid
                          }
                        })
                      case 'Event':
                        return navigation.navigate('EventDetail', { item: item, id: item.Eid })
                      case 'News':
                        return navigation.navigate('NewsDetail', { item: item, id: item.Eid })
                      case 'Feature':
                        return navigation.navigate('FeatureDetail', { item: item, id: item.Eid })
                      case 'Venue':
                        return navigation.navigate('VenueDetails', {
                          item: {
                            Id: item.Eid,
                            ...item
                          },
                          id: item.Eid
                        })
                    }
                  }}
                >
                  <View
                    style={{
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                      overflow: 'hidden',
                      width: 128
                      // borderColor: "#ff0000",
                      // borderWidth: 1,
                      // justifyContent: 'center',
                      // alignItems: 'stretch',
                    }}
                  >
                    <Image
                      source={{
                        uri: item.ImageSquareThumbURL
                      }}
                      style={{
                        flex: 1
                      }}
                      resizeMode="cover"
                    />
                    {this.renderPrice(item.EntityName, item.Price, 'AED')}
                  </View>

                  <View
                    style={{
                      flexDirection: 'column',
                      flex: 2,
                      // justifyContent: 'space-between',
                      justifyContent: 'flex-start',
                      // borderColor: "#ff0000",
                      // borderWidth: 1,
                      paddingTop: item.EntityName == undefined ? 11 : 33,
                      paddingBottom: 11,
                      paddingLeft: 12,
                      paddingRight: 12
                    }}
                  >
                    {this.renderTypeName(item.EntityName)}

                    <Text
                      numberOfLines={2}
                      style={{
                        // fontSize: 18,
                        // fontFamily: fontFamily.gothamBold,
                        // lineHeight: 24,
                        color: colors.basicText,
                        fontSize: 16,
                        fontFamily: fontFamily.gothamBold,
                        lineHeight: 24,
                        textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
                        marginBottom: 4
                      }}
                    >
                      {item.Title}
                    </Text>

                    {item.EntityName === 'Venue' ? null : this._getDate(item.EventDate)}

                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 12,
                        fontFamily: fontFamily.gothamLight,
                        lineHeight: 20,
                        textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                      }}
                    >
                      {item.Description}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          {this.state.results.length === 0 && (
            <Text
              style={{
                marginTop: 150,
                textAlign: 'center',
                marginBottom: 5,
                color: '#9E9E9B',
                fontSize: 24,
                fontFamily: fontFamily.gothamMedium,
                lineHeight: 32
              }}
            >
              {i18n.t('search.no_matches')}
            </Text>
          )}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  filterOptions: state.headerSearch.filters,
  sortOptions: state.headerSearch.sortOptions
})

const mapDispatchToProps = {
  clearFiltersAndSorting: actions.clearSearchData
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSearchScreen)
