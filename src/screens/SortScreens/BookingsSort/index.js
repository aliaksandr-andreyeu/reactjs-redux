import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import SortLayout from '../../../components/SortAndFilter/SortAndFilterLayout';
import SortOrderItem from '../../../components/SortAndFilter/SortOrderItem';
import * as actions from '../../NewsScreen/actions';
import { defaultSortOptions } from '../../NewsScreen/reducers';
import i18n from '../../../../i18n';

class BookingsSort extends Component {
  constructor(props) {
    super(props);
    const { name, date, venue, sportsCategory } = props;

    this.state = {
      name,
      date,
      venue,
      sportsCategory,
    };
  }

  handleOptionPress = optionKey => value =>
    this.setState({
      [optionKey]: value,
    });

  applySorting = () => {
    const { name, date, venue, sportsCategory } = this.state;
    const { updateStore } = this.props;

    updateStore({ name, date, venue, sportsCategory });
  };

  clearFilters = () => {
    this.setState(defaultSortOptions);
  };

  render() {
    const { name, date, venue, sportsCategory } = this.state;

    return (
      <SortLayout
        title={i18n.t('sorting.sort_by')}
        onApply={this.applySorting}
        onCancel={this.clearFilters}
      >
        <SortOrderItem
          propStyles={{ marginBottom: 15 }}
          sortOrder={name}
          label={i18n.t('sorting.name')}
          onPress={this.handleOptionPress('name')}
        />
        <SortOrderItem
          propStyles={{ marginBottom: 15 }}
          sortOrder={date}
          label={i18n.t('sorting.date')}
          onPress={this.handleOptionPress('date')}
        />
        <SortOrderItem
          propStyles={{ marginBottom: 15 }}
          sortOrder={sportsCategory}
          label={i18n.t('sorting.sports_category')}
          onPress={this.handleOptionPress('sportsCategory')}
        />
      </SortLayout>
    );
  }
}

BookingsSort.propTypes = {
  name: propTypes.number.isRequired,
  date: propTypes.number.isRequired,
  venue: propTypes.number.isRequired,
  sportsCategory: propTypes.number.isRequired,
  updateStore: propTypes.func.isRequired,
};

const mapStateToProps = state => ({
  name: state.news.sortOptions.name,
  date: state.news.sortOptions.date,
  venue: state.news.sortOptions.venue,
  sportsCategory: state.news.sortOptions.sportsCategory,
});
const mapDispatchToProps = {
  updateStore: actions.setNewsSorting,
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingsSort);
