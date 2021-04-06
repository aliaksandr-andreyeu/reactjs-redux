import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import styles from './styles'
import FilterOption from '../../../components/SortAndFilter/FilterOption'
import ConfirmButtons from '../../../components/UI/ConfirmButtons'
import * as actions from '../../HeaderSearchScreen/actions'
import { axiosInstance, apiUrls } from '../../../constants/api'
import Loading from '../../../components/Loading'
import i18n from '../../../../i18n'

class HeaderSearchFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    const requests = [axiosInstance(`${apiUrls.getSportCategories}?langCode=${i18n.locale.toUpperCase()}`)]

    Promise.all(requests).then(([sportCategories]) => {
      this.setState({
        isLoading: false
      })
    })
  }

  mapList = (list, labelKey, idKey = 'Id') =>
    list.map(item => ({
      id: item[idKey],
      label: item[labelKey]
    }))

  // applyFilters = () => {};

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
    // get data from redux store
    const { contentType } = this.props
    const { isLoading } = this.state

    if (isLoading) {
      return <Loading />
    }

    return (
      <View style={styles.container}>
        <View style={styles.innerWrapper}>
          <FilterOption
            label={i18n.t('filters.select_type')}
            targetScreen="RadioFilterScreen"
            navigationData={{
              onApply: this.applyRadioFilter('contentType'),
              selectedItems: [contentType],
              isHomeScreen: true,
              items: [
                { id: '', label: i18n.t('filters.all') },
                { id: 'venue', label: i18n.t('filters.venues') },
                { id: 'event', label: i18n.t('filters.events') },
                { id: 'news', label: i18n.t('filters.news') },
                { id: 'feature', label: i18n.t('filters.features') },
                { id: 'activity', label: i18n.t('filters.activities') },
                { id: 'match', label: i18n.t('filters.matches') }
              ],
              screenTitle: i18n.t('filters.select_type')
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
  contentType: state.headerSearch.filters.contentType
})

const mapDispatchToProps = {
  updateStore: actions.setSearchData,
  setFilter: actions.setSearchFilter,
  clearFilter: actions.clearSearchFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSearchFilter)
