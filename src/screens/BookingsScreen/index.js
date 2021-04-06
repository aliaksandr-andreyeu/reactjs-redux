import React from 'react'
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
  TextInput
} from 'react-native'

import moment from 'moment'

import { connect } from 'react-redux'
import isEqual from 'lodash.isequal'

import Loading from '../../components/Loading'

import AsyncStorage from '@react-native-community/async-storage'
import Moment from 'moment'
import FA5Icons from 'react-native-vector-icons/FontAwesome5'
import { axiosInstance, apiUrls } from '../../constants/api'
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

class BookingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />,
      title: i18n.t('bookingsLanding.title')
    }
  }

  constructor(props) {
    super(props)

    const eventType =
      sportActivityTypes.TicketedEvents + sportActivityTypes.FreeEvents + sportActivityTypes.GeneralAdmission

    const venueType =
      sportActivityTypes.FullFacilityRental +
      sportActivityTypes.SingleEntry +
      sportActivityTypes.Membership +
      sportActivityTypes.GeneralPackage

    this.state = {
      searchText: '',
      user: {},
      // venuesList: [],
      dataSource: {
        isLoading: false
      },

      categoryLabel: '',
      activityTypeLabel: '',
      dateLabel: '',

      sportCategoriesList: [],
      eventTypesList: [
        new EventType(sportActivityTypes.all, i18n.t('bookPlay.all')),
        new EventType(eventType, i18n.t('bookPlay.events')),
        new EventType(venueType, i18n.t('bookPlay.play')),
        new EventType(sportActivityTypes.SocialSportsActivities, i18n.t('bookPlay.join_match'))
      ],

      isLoading: true
    }
  }

  componentDidMount() {
    const { clearFiltersAndSorting } = this.props
    clearFiltersAndSorting()

    this.setCategoryLabel()
    this.setDatesLabel()
    this.setActivityLabel()

    const requests = [
      axiosInstance(`${apiUrls.getSportCategories}?langCode=${i18n.locale.toUpperCase()}`)
      // axiosInstance.post(apiUrls.postVenues, {}),
    ]

    Promise.all(requests).then(([sportCategories, venues]) => {
      this.setState({
        // venuesList: this.mapList(venues.data, 'Title'),
        sportCategoriesList: this.mapList(sportCategories.data, 'NameInPrimaryLang'),
        isLoading: false
      })
    })
  }

  mapList = (list, labelKey, idKey = 'Id') =>
    list.map(item => ({
      id: item[idKey],
      label: item[labelKey]
    }))

  setCategoryLabel() {
    const { filterOptions } = this.props

    if (filterOptions.categoryOfSports.length === 0) {
      this.setState({
        categoryLabel: ''
      })
      return
    }

    for (let o of this.state.sportCategoriesList) {
      if (+o.id === +filterOptions.categoryOfSports[0]) {
        let categoryLabel = o.label
        if (filterOptions.categoryOfSports.length > 1) {
          categoryLabel += '...'
        }

        this.setState({
          categoryLabel: categoryLabel
        })

        return
      }
    }
  }

  setDatesLabel() {
    const { filterOptions } = this.props

    if (filterOptions.dateRange.length === 0) {
      this.setState({
        dateLabel: ''
      })
      return
    }

    let dateLabel = filterOptions.dateRange.map(item => {
      return moment(item).format('DD-MM-YYYY')
    })

    this.setState({
      dateLabel: dateLabel.join(' - ')
    })
  }

  setActivityLabel() {
    const { filterOptions } = this.props

    if (filterOptions.eventType.length === 0) {
      this.setState({
        activityTypeLabel: ''
      })
      return
    }

    for (let o of this.state.eventTypesList) {
      if (+o.id === +filterOptions.eventType[0]) {
        let activityTypeLabel = o.label
        if (filterOptions.eventType.length > 1) {
          activityTypeLabel += '...'
        }

        this.setState({
          activityTypeLabel: activityTypeLabel
        })

        return
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { sortOptions, filterOptions } = this.props

    console.log('sortOptions', sortOptions)
    console.log('filterOptions', filterOptions)

    if (!isEqual(sortOptions, prevProps.sortOptions) || !isEqual(filterOptions, prevProps.filterOptions)) {
      this.setCategoryLabel()
      this.setDatesLabel()
      this.setActivityLabel()
    }
  }

  applyCategoryOfSportsFilter = itemKey => update => {
    const { setFilter, navigation } = this.props

    setFilter({
      [itemKey]: update
    })

    navigation.goBack()
  }

  applyActivityTypeFilter = itemKey => update => {
    const { setFilter, navigation } = this.props

    setFilter({
      [itemKey]: update
    })

    navigation.goBack()
  }

  applyDateFilter = itemKey => update => {
    const { setFilter, navigation } = this.props

    console.log(itemKey, update)

    setFilter({
      [itemKey]: update
    })

    navigation.goBack()
  }

  search() {
    // const { filterOptions } = this.props;

    this.props.navigation.navigate('BookingsList')
    // , {
    // form: {
    // categoryOfSports: filterOptions.categoryOfSports,
    // activityType: filterOptions.eventType,
    // dateRange: filterOptions.dateRange,
    // },
    // });
  }

  selectCategory() {
    const { filterOptions } = this.props

    this.props.navigation.navigate('FilterWithSectionsScreen', {
      onApply: this.applyCategoryOfSportsFilter('categoryOfSports'),
      selectedItems: filterOptions.categoryOfSports,
      items: this.state.sportCategoriesList,
      screenTitle: i18n.t('filters.category_of_sports')
    })
  }

  selectActivityType() {
    const { filterOptions } = this.props

    this.props.navigation.navigate('CheckboxFilterScreen', {
      onApply: this.applyActivityTypeFilter('eventType'),
      selectedItems: filterOptions.eventType,
      items: this.state.eventTypesList,
      screenTitle: i18n.t('filters.activity_type')
    })
  }

  selectDateRange() {
    const { filterOptions } = this.props

    this.props.navigation.navigate('DateRangeFilter', {
      onApply: this.applyDateFilter('dateRange'),
      selectedItems: filterOptions.dateRange,
      screenTitle: i18n.t('filters.start_date')
    })
  }

  render() {
    Moment.locale('en')
    const { navigation } = this.props
    //const { venuesList, eventTypesList, sportCategoriesList, isLoading } = this.state;
    const { eventTypesList, sportCategoriesList, isLoading } = this.state

    if (isLoading || this.state.dataSource.isLoading) {
      return <Loading />
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            paddingTop: 0,
            paddingBottom: 12
          }}
        >
          <View
            style={{
              marginTop: 8,
              marginHorizontal: 16,
              borderRadius: 10,
              overflow: 'hidden'
            }}
          >
            <View>
              <Image source={BookingsPromoImage} style={{ width: '100%', borderRadius: 5 }} />
              <View
                style={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  bottom: 14,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                }}
              >
                <Text
                  style={{
                    ...styles.bookingsPromoTitle,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                  }}
                >
                  {i18n.t('bookingsLanding.title')}
                </Text>
                <Text
                  style={{
                    ...styles.bookingsPromoTitle,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                  }}
                >
                  {i18n.t('bookingsLanding.promo_title1')}
                </Text>
                <Text
                  style={{
                    ...styles.bookingsPromoSubtitle,
                    textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                  }}
                >
                  {i18n.t('bookingsLanding.promo_subtitle')}
                </Text>
              </View>
            </View>

            <View style={styles.bookingsSearchContainer}>
              <Text style={styles.bookingsSearchTitle}>{i18n.t('bookingsLanding.title')}</Text>

              <View style={{ marginTop: 20 }}>
                <TouchableOpacity
                  style={{
                    ...styles.bookingsSearchInput,
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
                  }}
                  onPress={() => {
                    this.selectCategory()
                  }}
                >
                  <Text
                    style={{
                      ...styles.bookingFormInput,
                      textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                    }}
                  >
                    {this.state.categoryLabel.length > 0
                      ? this.state.categoryLabel
                      : i18n.t('bookingsLanding.searchFormCategory')}
                  </Text>
                  <FA5Icons style={styles.bookingSearchInputIcon} name="chevron-down" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...styles.bookingsSearchInput,
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
                  }}
                  onPress={() => {
                    this.selectDateRange()
                  }}
                >
                  <Text
                    style={{
                      ...styles.bookingFormInput,
                      textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                    }}
                  >
                    {this.state.dateLabel.length > 0
                      ? this.state.dateLabel
                      : i18n.t('bookingsLanding.searchFormStartDate')}
                  </Text>
                  <FA5Icons style={styles.bookingSearchInputIcon} name="calendar-alt" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    ...styles.bookingsSearchInput,
                    flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
                  }}
                  onPress={() => {
                    this.selectActivityType()
                  }}
                >
                  <Text
                    style={{
                      ...styles.bookingFormInput,
                      textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                    }}
                  >
                    {this.state.activityTypeLabel.length > 0
                      ? this.state.activityTypeLabel
                      : i18n.t('bookingsLanding.searchFormActivityType')}
                  </Text>
                  <FA5Icons style={styles.bookingSearchInputIcon} name="chevron-down" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.bookingsSearchButton}
                onPress={() => {
                  this.search()
                }}
              >
                <SkewedContainer
                  style={styles.bookingsSearchButton}
                  backgroundColor={colors.themeColor}
                  leftSkewType="desc"
                  rightSkewType="asc"
                >
                  <Text style={styles.bookingsSearchButtonText}>{i18n.t('bookingsLanding.search')}</Text>
                </SkewedContainer>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  filterOptions: state.bookings.filters,
  sortOptions: state.bookings.sortOptions
})

const mapDispatchToProps = {
  updateStore: actions.setBookingsData,
  setFilter: actions.setBookingsFilter,
  clearFiltersAndSorting: actions.clearBookingsData,
  setBookingsData: actions.setBookingsData
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingsScreen)
