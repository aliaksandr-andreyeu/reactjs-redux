import React, { Component } from 'react';
import { View, ScrollView, Text, Keyboard, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AutocompleteInput from '../../../components/UI/AutocompleteInput';
import Dropdown from '../../../components/UI/Dropdown';
import SsaScreenTitle from '../components/SsaScreenTitle';
import ConfirmButtons from '../../../components/UI/ConfirmButtons';
import styles from './styles';
import * as actions from '../../SsaMainScreen/actions';
import { getValueById } from '../../../helpers/getValueById';
import ErrorMessage from '../../../components/ErrorMessage';
import i18n from '../../../../i18n';

class VenueScreen extends Component {
  constructor(props) {
    super(props);

    const { navigation, venueId, facilityId } = props;

    this.state = {
      facilities: [],
      venueId: venueId.toString(),
      facilityId: facilityId.toString(),
      applyIsPressed: false,
    };

    this.venues = navigation.getParam('venues');

    this.dropdownRef = React.createRef();
  }

  selectCategory = ({ venueId }) => {
    this.setState(
      {
        facilities: Object.values(this.venues[venueId].facilities),
        venueId: venueId.toString(),
        facilityId: '',
      },
      () => Keyboard.dismiss()
    );
  };

  selectFacility = id => {
    this.setState(
      {
        facilityId: id.toString(),
      },
      () => this.dropdownRef.current.toggleDropdown()
    );
  };

  handleAutocompleteChange = () => {
    this.setState({
      venueId: '',
      facilityId: '',
    });
  };

  handleSave = () => {
    const { venueId, facilityId } = this.state;
    const { changeCategory } = this.props;

    if (venueId && facilityId) {
      changeCategory({
        venueId: venueId.toString(),
        facilityId: facilityId.toString(),
        date: '',
        startTime: '',
        endTime: '',
        packageId: '',
      });
    }
    this.setState({
      applyIsPressed: true,
    });
  };

  render() {
    const { facilities, venueId, facilityId, applyIsPressed } = this.state;

    const venueIsComplete = Boolean(venueId);
    const facilityIsComplete = Boolean(facilityId);
    const stepIsComplete = venueIsComplete && facilityIsComplete;
    const venueHasError = applyIsPressed && !venueIsComplete;
    const facilityHasError = applyIsPressed && !facilityIsComplete;

    const venuesArray = Object.values(this.venues);

    const facilitiesDefaultValue =
      !facilities.length && venueId
        ? i18n.t('venues.no_facilities')
        : i18n.t('venues.available_facilities');
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.innerWrapper}>
          <SsaScreenTitle text={i18n.t('venues.venue')} />
          <AutocompleteInput
            placeholder={i18n.t('socialSportsActivity.searchField')}
            value={venueIsComplete ? this.venues[venueId].venueTitle : ''}
            callbackOnSelect={this.selectCategory}
            itemsList={venuesArray}
            idKey="venueId"
            filterKey="venueTitle"
            hasResetButton
            callbackOnChange={this.handleAutocompleteChange}
            error={venueHasError}
          />
          {venueHasError && (
            <ErrorMessage errorMessage={i18n.t('generic.errors.field_is_required')} />
          )}
          <Dropdown
            ref={this.dropdownRef}
            title={
              facilityId
                ? this.venues[venueId].facilities[facilityId].facilityTitle
                : facilitiesDefaultValue
            }
            selectedItem={facilityId ? getValueById(facilities, facilityId, 'Title') : ''}
            isDisabled={!venueId || !facilities.length}
            error={facilityHasError}
          >
            {facilities.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={{ marginBottom: 10 }}
                onPress={() => this.selectFacility(item.facilityId)}
              >
                <Text style={styles.facilitiesText}>{item.facilityTitle}</Text>
              </TouchableOpacity>
            ))}
          </Dropdown>
          {facilityHasError && (
            <ErrorMessage errorMessage={i18n.t('generic.errors.field_is_required')} />
          )}
        </View>
        <View>
          <ConfirmButtons
            confirmLabel={i18n.t('generic.buttons.apply')}
            cancelLabel={i18n.t('generic.buttons.clear')}
            handleSave={this.handleSave}
            closeOnApply={stepIsComplete}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  venueId: state.socialSportActivity.venueId,
  facilityId: state.socialSportActivity.facilityId,
});
const mapDispatchToProps = {
  changeCategory: actions.setData,
};

export default connect(mapStateToProps, mapDispatchToProps)(VenueScreen);
