import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import styles from './styles'
import FilterOption from '../../../components/SortAndFilter/FilterOption'
import ConfirmButtons from '../../../components/UI/ConfirmButtons'
import * as actions from '../../BookingsScreen/actions'
import { axiosInstance, apiUrls } from '../../../constants/api'
import { EventType } from './models'
import { sportActivityTypes } from '../../../constants/socialSportsActivity'
import Loading from '../../../components/Loading'
import i18n from '../../../../i18n'

class BookingsFilter extends Component {
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
      sportCategoriesList: [],
      distance: [],
      isLoading: true,
      eventTypesList: [
        new EventType(sportActivityTypes.all, i18n.t('bookPlay.all')),
        new EventType(eventType, i18n.t('bookPlay.events')),
        new EventType(venueType, i18n.t('bookPlay.play')),
        new EventType(sportActivityTypes.SocialSportsActivities, i18n.t('bookPlay.join_match'))
      ]
    }
  }

  componentDidMount() {
    const requests = [
      axiosInstance(`${apiUrls.getSportCategories}?langCode=${i18n.locale.toUpperCase()}`),
      axiosInstance.post(apiUrls.postVenues, {})
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

  handleCancel = () => {
    const { clearFilter } = this.props

    clearFilter()
  }

  applyFilter = itemKey => update => {
    const { setFilter, navigation } = this.props

    setFilter({
      [itemKey]: update
    })

    navigation.goBack()
  }

  applyRadioFilter = itemKey => update => {
    const { setFilter, navigation } = this.props

    setFilter({
      [itemKey]: update.join()
    })

    navigation.goBack()
  }

  render() {
    const { eventType, categoryOfSports, dateRange, distance } = this.props
    const { sportCategoriesList, isLoading } = this.state

    if (isLoading) {
      return <Loading />
    }

    return (
      <View style={styles.container}>
        <View style={styles.innerWrapper}>
          <FilterOption
            label={i18n.t('filters.category_of_sports')}
            targetScreen="FilterWithSectionsScreen"
            navigationData={{
              onApply: this.applyFilter('categoryOfSports'),
              selectedItems: categoryOfSports,
              items: sportCategoriesList,
              screenTitle: i18n.t('filters.category_of_sports')
            }}
          />
          <FilterOption
            label={i18n.t('filters.distance')}
            targetScreen="RadioFilterScreen"
            navigationData={{
              onApply: this.applyRadioFilter('distance'),
              selectedItems: [distance],
              isBookingsListScreen: true,
              items: [
                { id: '5000', label: i18n.t('filters.near_me') },
                { id: '10000', label: i18n.t('filters.10km') },
                { id: '15000', label: i18n.t('filters.15km') },
                { id: '20000', label: i18n.t('filters.20km') },
                { id: '25000', label: i18n.t('filters.25km') },
                { id: '30000', label: i18n.t('filters.30km') }
              ],
              screenTitle: i18n.t('filters.select_distance')
            }}
          />
          <FilterOption
            label={i18n.t('filters.daterange')}
            targetScreen="DateRangeFilter"
            navigationData={{
              onApply: this.applyFilter('dateRange'),
              selectedItems: dateRange,
              screenTitle: i18n.t('filters.daterange')
            }}
          />
          <FilterOption
            label={i18n.t('filters.activity_type')}
            targetScreen="CheckboxFilterScreen"
            navigationData={{
              onApply: this.applyFilter('eventType'),
              selectedItems: eventType,
              items: this.state.eventTypesList,
              screenTitle: i18n.t('filters.activity_type')
            }}
          />
        </View>
        <ConfirmButtons
          handleSave={() => false}
          handleCancel={() => this.handleCancel()}
          confirmLabel={i18n.t('generic.buttons.apply')}
          cancelLabel={i18n.t('generic.buttons.reset')}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  eventType: state.bookings.filters.eventType,
  categoryOfSports: state.bookings.filters.categoryOfSports,
  dateRange: state.bookings.filters.dateRange,
  distance: state.bookings.filters.distance
})
const mapDispatchToProps = {
  updateStore: actions.setBookingsData,
  setFilter: actions.setBookingsFilter,
  clearFilter: actions.clearBookingsFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingsFilter)
