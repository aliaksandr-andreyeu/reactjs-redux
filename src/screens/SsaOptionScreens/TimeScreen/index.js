import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import propTypes from 'prop-types';
import ConfirmButtons from '../../../components/UI/ConfirmButtons';
import styles from './styles';
import { setData } from '../../SsaMainScreen/actions';
import i18n from '../../../../i18n';
import colors from '../../../constants/colors';

class SsaTimeScreen extends Component {
  constructor(props) {
    super(props);

    const { startTime, endTime, timeSlotId } = props;

    this.state = {
      startTime,
      endTime,
      timeSlotId,
    };
  }

  selectTimeslot = timeSlot => {
    this.setState({
      startTime: timeSlot.Start,
      endTime: timeSlot.End,
      timeSlotId: timeSlot.Id,
    });
  };

  renderItem = (timeSlot, index) => {
    const { startTime, endTime } = this.state;
    const isActive = timeSlot.Start === startTime && timeSlot.End === endTime;

    let timeValue = '';
    timeValue += timeSlot && timeSlot.Start ? `${timeSlot.Start}` : '';
    timeValue += timeSlot && timeSlot.Start && timeSlot.End ? ` - ${timeSlot.End}` : '';

    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.selectTimeslot(timeSlot)}
        style={[styles.hourContainer, isActive && styles.hourContainerActive]}
      >
        <Text style={[styles.itemText, isActive && styles.activeItemText]}>
          {/*[timeSlot.Start, timeSlot.End].join(' - ')*/}
          {timeValue}
        </Text>
      </TouchableOpacity>
    );
  };

  saveOption = () => {
    const { closeModal } = this.props;
    const { startTime, endTime, timeSlotId } = this.state;

    const isComplete = startTime && endTime !== undefined;
    if (isComplete && closeModal) {
      closeModal({ startTime, endTime, timeSlotId });
    }
  };

  handleCancel = () => {
    const { closeModal } = this.props;

    if (closeModal) {
      closeModal();
    }
  };

  render() {
    const { timeslots } = this.props;

    return (
      <ScrollView contentContainerStyle={{ justifyContent: 'flex-end' }}>
        <View
          style={{
            paddingTop: 25,
            flex: 1,
            backgroundColor: colors.brandColorBright,
            justifyContent: 'center',
          }}
        >
          <View style={[styles.halfDaySection, { borderBottomWidth: 0 }]}>
            {timeslots.map((hours, index) => this.renderItem(hours, index))}
          </View>
        </View>
        <ConfirmButtons
          confirmLabel={i18n.t('generic.buttons.apply')}
          cancelLabel={i18n.t('generic.buttons.clear')}
          handleSave={this.saveOption}
          handleCancel={this.handleCancel}
          closeOnApply={false}
          closeOnCancel={false}
          containerStyle={{ flex: 1, backgroundColor: colors.themeColor }}
          buttonStyle={{ borderWidth: 1, borderColor: colors.borderLight }}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  startTime: state.socialSportActivity.startTime,
  endTime: state.socialSportActivity.endTime,
  packageId: state.socialSportActivity.packageId,
  timeSlotId: state.socialSportActivity.packageId,
});

SsaTimeScreen.propTypes = {
  timeslots: propTypes.arrayOf(
    propTypes.shape({
      Id: propTypes.number.isRequired,
      // Start: propTypes.string.isRequired,
      // End: propTypes.string.isRequired,
      Start: propTypes.string,
      End: propTypes.string,
    })
  ).isRequired,
  // startTime: propTypes.string.isRequired,
  // endTime: propTypes.string.isRequired,
  startTime: propTypes.string,
  endTime: propTypes.string,
  closeModal: propTypes.func.isRequired,
  // timeSlotId: propTypes.number.isRequired,
  timeSlotId: propTypes.number,
};

export default connect(mapStateToProps, { setData })(SsaTimeScreen);
