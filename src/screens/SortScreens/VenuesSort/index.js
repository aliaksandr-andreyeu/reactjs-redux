import React, { Component } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import SortLayout from '../../../components/SortAndFilter/SortAndFilterLayout'
import SortOrderItem from '../../../components/SortAndFilter/SortOrderItem'
import * as actions from '../../VenuesScreen/actions'
import { defaultSortOptions } from '../../VenuesScreen/reducers'
import i18n from '../../../../i18n'

class NewsSort extends Component {
  constructor(props) {
    super(props)
    const { name, date, venue, sportsCategory } = props

    this.state = {
      name,
      date,
      venue,
      sportsCategory
    }
  }

  handleOptionPress = optionKey => value =>
    this.setState({
      [optionKey]: value
    })

  applySorting = () => {
    const { name, date, venue, sportsCategory } = this.state
    const { updateStore } = this.props

    updateStore({ name, date, venue, sportsCategory })
  }

  clearFilters = () => {
    this.setState(defaultSortOptions)
  }

  render() {
    const { name, sportsCategory } = this.state

    return (
      <SortLayout title={i18n.t('sorting.sort_by')} onApply={this.applySorting} onCancel={this.clearFilters}>
        <SortOrderItem
          propStyles={{ marginBottom: 15 }}
          sortOrder={name}
          isVenuesScreen={true}
          label={i18n.t('sorting.alphabetical')}
          onPress={this.handleOptionPress('name')}
        />
      </SortLayout>
    )
  }
}

NewsSort.propTypes = {
  name: propTypes.number.isRequired,
  sportsCategory: propTypes.number.isRequired,
  updateStore: propTypes.func.isRequired
}

const mapStateToProps = state => ({
  name: state.venues.sortOptions.name,
  sportsCategory: state.venues.sortOptions.sportsCategory
})
const mapDispatchToProps = {
  updateStore: actions.setVenuesSorting
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsSort)
