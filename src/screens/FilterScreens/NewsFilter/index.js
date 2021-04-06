import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import styles from './styles'
import FilterOption from '../../../components/SortAndFilter/FilterOption'
import ConfirmButtons from '../../../components/UI/ConfirmButtons'
import * as actions from '../../NewsScreen/actions'
import { axiosInstance, apiUrls } from '../../../constants/api'
import { EventType } from './models'
import { sportActivityTypes } from '../../../constants/socialSportsActivity'
import Loading from '../../../components/Loading'
import i18n from '../../../../i18n'

class EventsFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sportCategoriesList: [],
      isLoading: true
    }
  }

  componentDidMount() {
    const requests = [
      axiosInstance(`${apiUrls.getSportCategories}?langCode=${i18n.locale.toUpperCase()}`),
      axiosInstance.post(apiUrls.postVenues, {})
    ]

    Promise.all(requests).then(([sportCategories, venues]) => {
      this.setState({
        venuesList: this.mapList(venues.data, 'Title'),
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

  render() {
    const { categoryOfSports, dateRange } = this.props
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
            label={i18n.t('filters.daterange')}
            targetScreen="DateRangeFilter"
            navigationData={{
              onApply: this.applyFilter('dateRange'),
              selectedItems: dateRange,
              screenTitle: i18n.t('filters.daterange')
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
  categoryOfSports: state.news.filters.categoryOfSports,
  dateRange: state.news.filters.dateRange
})
const mapDispatchToProps = {
  updateStore: actions.setNewsData,
  setFilter: actions.setNewsFilter,
  clearFilter: actions.clearNewsFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsFilter)
