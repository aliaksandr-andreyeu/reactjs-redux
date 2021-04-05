import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import FilterOption from '../../../components/SortAndFilter/FilterOption';
import ConfirmButtons from '../../../components/UI/ConfirmButtons';
import * as actions from '../../VenuesScreen/actions';
import { axiosInstance, apiUrls } from '../../../constants/api';
import Loading from '../../../components/Loading';
import i18n from '../../../../i18n';

class VenuesFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sportCategoriesList: [],
      distance: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    const requests = [
      axiosInstance(`${apiUrls.getSportCategories}?langCode=${i18n.locale.toUpperCase()}`),
    ];

    Promise.all(requests).then(([sportCategories]) => {
      this.setState({
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
    const { categoryOfSports, distance } = this.props;
    const { sportCategoriesList, isLoading } = this.state;

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
          <FilterOption
            label={i18n.t('filters.distance')}
            targetScreen="RadioFilterScreen"
            navigationData={{
              onApply: this.applyRadioFilter('distance'),
              selectedItems: [distance],
              isVenuesScreen: true,
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
  categoryOfSports: state.venues.filters.categoryOfSports,
  distance: state.venues.filters.distance,
});

const mapDispatchToProps = {
  updateStore: actions.setVenuesData,
  setFilter: actions.setVenuesFilter,
  clearFilter: actions.clearVenuesFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(VenuesFilter);
