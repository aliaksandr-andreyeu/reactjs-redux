import React, { Component } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import SortLayout from '../../../components/SortAndFilter/SortAndFilterLayout'
import SortOrderItem from '../../../components/SortAndFilter/SortOrderItem'
import * as actions from '../../EventsScreen/actions'
import { defaultSortOptions } from '../../EventsScreen/reducers'
import i18n from '../../../../i18n'

class EventsSort extends Component {
  constructor(props) {
    super(props)
    const { name, date, venue, sportsCategory, price } = props

    this.state = {
      name,
      date,
      venue,
      sportsCategory,
      price
    }
  }

  handleOptionPress = optionKey => value =>
    this.setState({
      [optionKey]: value
    })

  applySorting = () => {
    const { name, date, venue, sportsCategory, price } = this.state
    const { updateStore } = this.props

    updateStore({ name, date, venue, sportsCategory, price })
  }

  clearFilters = () => {
    this.setState(defaultSortOptions)
  }

  render() {
    const { name, date, venue, sportsCategory, price } = this.state

    return (
      <SortLayout title={i18n.t('sorting.sort_by')} onApply={this.applySorting} onCancel={this.clearFilters}>
        {/*
        <SortOrderItem
          propStyles={{ marginBottom: 15 }}
          sortOrder={name}
          label={i18n.t('sorting.name')}
          onPress={this.handleOptionPress('name')}
        />
        */}
        {/*
        <SortOrderItem
          propStyles={{ marginBottom: 15 }}
          sortOrder={date}
          label={i18n.t('sorting.date')}
          onPress={this.handleOptionPress('date')}
        />
        */}
        {/*
        <SortOrderItem
          propStyles={{ marginBottom: 15 }}
          sortOrder={venue}
          label={i18n.t('sorting.venue')}
          onPress={this.handleOptionPress('venue')}
        />
        <SortOrderItem
          propStyles={{ marginBottom: 15 }}
          sortOrder={sportsCategory}
          label={i18n.t('sorting.sports_category')}
          onPress={this.handleOptionPress('sportsCategory')}
        />
        */}
        <SortOrderItem
          propStyles={{ marginBottom: 15 }}
          sortOrder={price}
          label={i18n.t('sorting.price')}
          onPress={this.handleOptionPress('price')}
        />
      </SortLayout>
    )
  }
}

EventsSort.propTypes = {
  name: propTypes.number.isRequired,
  date: propTypes.number.isRequired,
  venue: propTypes.number.isRequired,
  sportsCategory: propTypes.number.isRequired,
  price: propTypes.number.isRequired,
  updateStore: propTypes.func.isRequired
}

const mapStateToProps = state => ({
  name: state.events.sortOptions.name,
  date: state.events.sortOptions.date,
  venue: state.events.sortOptions.venue,
  sportsCategory: state.events.sortOptions.sportsCategory,
  price: state.events.sortOptions.price
})
const mapDispatchToProps = {
  updateStore: actions.setEventsSorting
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // null
)(EventsSort)

// export default EventsSort;
