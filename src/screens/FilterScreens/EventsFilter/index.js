import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import FilterOption from '../../../components/SortAndFilter/FilterOption';
import ConfirmButtons from '../../../components/UI/ConfirmButtons';
import * as actions from '../../EventsScreen/actions';
import { axiosInstance, apiUrls } from '../../../constants/api';
import { EventType } from './models';
import { sportActivityTypes } from '../../../constants/socialSportsActivity';
import Loading from '../../../components/Loading';
import i18n from '../../../../i18n';

class EventsFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venuesList: [],
      sportCategoriesList: [],
      eventTypesList: [
        new EventType(sportActivityTypes.TicketedEvents, i18n.t('more.free_spectating_events')),
        new EventType(sportActivityTypes.FreeEvents, i18n.t('more.ticketed_spectating_events')),
        new EventType(
          sportActivityTypes.SocialSportsActivities,
          i18n.t('more.social_sports_events')
        ),
      ],
      isLoading: true,
    };
  }

  componentDidMount() {
    const requests = [
      axiosInstance(`${apiUrls.getSportCategories}?langCode=${i18n.locale.toUpperCase()}`),
      axiosInstance.post(apiUrls.postVenues, {}),
    ];

    Promise.all(requests).then(([sportCategories, venues]) => {
      this.setState({
        venuesList: this.mapList(venues.data, 'Title'),
        sportCategoriesList: this.mapList(sportCategories.data, 'NameInPrimaryLang'),
        isLoading: false,
      });
    });
  }

  mapList = (list, labelKey, idKey = 'Id') =>
    list.map(item => ({
      id: item[idKey],
      label: item[labelKey],
    }));

  // applyFilters = () => {};

  handleCancel = () => {
    const { clearFilter } = this.props;

    clearFilter();
  };

  applyFilter = itemKey => update => {
    const { setFilter, navigation } = this.props;

    setFilter({
      [itemKey]: update,
    });

    navigation.goBack();
  };

  applyRadioFilter = itemKey => update => {
    const { setFilter, navigation } = this.props;

    setFilter({
      [itemKey]: update.join(),
    });

    navigation.goBack();
  };

  render() {
    // get data from redux store
    const { categoryOfSports, eventType, dateRange, venue, distance } = this.props;
    const { venuesList, eventTypesList, sportCategoriesList, isLoading } = this.state;

    if (isLoading) {
      return <Loading />;
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
              screenTitle: i18n.t('filters.category_of_sports'),
            }}
          />
          {/*
          <FilterOption
            label={i18n.t('filters.event_type')}
            targetScreen="CheckboxFilterScreen"
            navigationData={{
              onApply: this.applyFilter('eventType'),
              selectedItems: eventType,
              items: eventTypesList,
              screenTitle: i18n.t('filters.event_type'),
            }}
          />
          */}
          <FilterOption
            label={i18n.t('filters.daterange')}
            targetScreen="DateRangeFilter"
            navigationData={{
              onApply: this.applyFilter('dateRange'),
              selectedItems: dateRange,
              screenTitle: i18n.t('filters.daterange'),
            }}
          />
          {/*
          <FilterOption
            label={i18n.t('filters.venues')}
            targetScreen="FilterWithSectionsScreen"
            navigationData={{
              onApply: this.applyFilter('venue'),
              selectedItems: venue,
              items: venuesList,
              screenTitle: i18n.t('filters.venues'),
            }}
          />
          */}
          <FilterOption
            label={i18n.t('filters.distance')}
            targetScreen="RadioFilterScreen"
            navigationData={{
              onApply: this.applyRadioFilter('distance'),
              selectedItems: [distance],
              isEventsScreen: true,
              items: [
                { id: '5000', label: i18n.t('filters.near_me') },
                { id: '10000', label: i18n.t('filters.10km') },
                { id: '15000', label: i18n.t('filters.15km') },
                { id: '20000', label: i18n.t('filters.20km') },
                { id: '25000', label: i18n.t('filters.25km') },
                { id: '30000', label: i18n.t('filters.30km') },
              ],
              screenTitle: i18n.t('filters.select_distance'),
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
    );
  }
}

const mapStateToProps = state => ({
  categoryOfSports: state.events.filters.categoryOfSports,
  eventType: state.events.filters.eventType,
  dateRange: state.events.filters.dateRange,
  venue: state.events.filters.venue,
  distance: state.events.filters.distance,
});
const mapDispatchToProps = {
  updateStore: actions.setEventsData,
  setFilter: actions.setEventsFilter,
  clearFilter: actions.clearEventsFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsFilter);
