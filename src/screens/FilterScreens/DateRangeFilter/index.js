import React, { Component, createRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { dayNames } from './constants';
import styles from './styles';
import colors from '../../../constants/colors';
import { fontFamily, fontSize } from '../../../constants/fonts';
import ConfirmButtons from '../../../components/UI/ConfirmButtons';
import i18n from '../../../../i18n';

import localeDatePicker from './localeDatePicker';

class DateRangeFilter extends Component {
  constructor(props) {
    super(props);

    const { navigation } = props;
    const selectedItems = navigation.getParam('selectedItems', []);

    this.calendarRef = React.createRef();

    this.state = {
      fromDate: selectedItems[0] ? selectedItems[0] : null,
      toDate: selectedItems[1] ? selectedItems[1] : null,
      isFromDatePicked: !!selectedItems[0],
      isToDatePicked: !!selectedItems[1],
      markedDates: this.fillMarkedDates(),
      calendarRange: '',
    };
  }

  fillMarkedDates() {
    const selectedItems = this.props.navigation.getParam('selectedItems', []);
    let markedDates = {};

    if (selectedItems.length > 0) {
      let fromDate = null;
      let toDate = null;

      if (selectedItems[0]) {
        fromDate = selectedItems[0];

        markedDates = {
          [fromDate]: {
            color: colors.themeColor,
            textColor: colors.basicLightText,
            // customStyles: {
            // container: {
            // justifyContent: 'flex-end',
            // alignItems: 'flex-end',
            // textAlign: "right",
            // },
            // text: {
            // textAlign: "right",
            // },
            // },
          },
        };
      }

      if (selectedItems[1]) {
        fromDate = selectedItems[0];
        toDate = selectedItems[1];

        markedDates = {
          [fromDate]: {
            startingDay: true,
            color: colors.themeColor,
            textColor: colors.basicLightText,
            // customStyles: {
            // container: {
            // justifyContent: 'flex-end',
            // alignItems: 'flex-end',
            // textAlign: "right",
            // },
            // text: {
            // textAlign: "right",
            // },
            // },
          },
        };

        const mFromDate = moment(fromDate);
        const mToDate = moment(toDate);

        const range = mToDate.diff(mFromDate, 'days');

        if (range >= 0) {
          if (range === 0) {
            markedDates = {
              [toDate]: {
                color: colors.themeColor,
                textColor: colors.basicLightText,
                // customStyles: {
                // container: {
                // justifyContent: 'flex-end',
                // alignItems: 'flex-end',
                // textAlign: "right",
                // },
                // text: {
                // textAlign: "right",
                // },
                // },
              },
            };
          } else {
            for (let i = 1; i <= range; i++) {
              const tempDate = mFromDate.add(1, 'day').format('YYYY-MM-DD');
              if (i < range) {
                markedDates[tempDate] = {
                  color: colors.themeColor,
                  textColor: colors.basicLightText,
                  // customStyles: {
                  // container: {
                  // justifyContent: 'flex-end',
                  // alignItems: 'flex-end',
                  // textAlign: "right",
                  // },
                  // text: {
                  // textAlign: "right",
                  // },
                  // },
                };
              } else {
                markedDates[tempDate] = {
                  endingDay: true,
                  selected: true,
                  color: colors.themeColor,
                  textColor: colors.basicLightText,
                  // customStyles: {
                  // container: {
                  // justifyContent: 'flex-end',
                  // alignItems: 'flex-end',
                  // textAlign: "right",
                  // },
                  // text: {
                  // textAlign: "right",
                  // },
                  // },
                };
              }
            }
          }
        }
      }
    }
    return markedDates;
  }

  // componentDidUpdate() {
  // if (this.calendarRef.current) {
  // this.calendarRef.current.props.onDayPress = () => {
  // console.log('DID Update onDayPress', this.calendarRef.current.props);
  // // this.forceUpdate();
  // }
  // }
  // }

  handleSelect = date => {
    this.setState({
      selectedDate: date.dateString,
    });
  };

  onDayPress = day => {
    const { isFromDatePicked, isToDatePicked, markedDates, fromDate } = this.state;

    if (!isFromDatePicked || (isFromDatePicked && isToDatePicked)) {
      this.setupStartMarker(day);
    } else if (!isToDatePicked) {
      // const markedDatesCopy = JSON.parse(JSON.stringify(markedDates));
      const markedDatesCopy = { ...markedDates };

      const [mMarkedDates, range] = this.setupMarkedDates(
        fromDate,
        day.dateString,
        markedDatesCopy
      );
      if (range >= 0) {
        this.setState({
          isFromDatePicked: true,
          toDate: day.dateString,
          isToDatePicked: true,
          markedDates: mMarkedDates,
        });
        // this.props.onSuccess(this.state.fromDate, day.dateString);
      } else {
        this.setupStartMarker(day);
      }
    }
  };

  setupStartMarker = day => {
    const markedDates = {
      [day.dateString]: {
        startingDay: true,
        color: colors.themeColor,
        textColor: colors.basicLightText,
        // customStyles: {
        // container: {
        // justifyContent: 'flex-end',
        // alignItems: 'flex-end',
        // textAlign: "right",
        // padding: 20,
        // },
        // text: {
        // textAlign: "right",
        // },
        // },
      },
    };
    this.setState({
      isFromDatePicked: true,
      isToDatePicked: false,
      fromDate: day.dateString,
      toDate: null,
      markedDates,
    });
  };

  setupMarkedDates = (fromDate, toDate, markedDates = {}) => {
    // let markedDatesCopy = JSON.parse(JSON.stringify(markedDates));
    let markedDatesCopy = { ...markedDates };

    const mFromDate = moment(fromDate);
    const mToDate = moment(toDate);
    const range = mToDate.diff(mFromDate, 'days');
    if (range >= 0) {
      if (range === 0) {
        markedDatesCopy = {
          [toDate]: {
            color: colors.themeColor,
            textColor: colors.basicLightText,
            // customStyles: {
            // container: {
            // justifyContent: 'flex-end',
            // alignItems: 'flex-end',
            // textAlign: "right",
            // },
            // text: {
            // textAlign: "right",
            // },
            // },
          },
        };
      } else {
        for (let i = 1; i <= range; i++) {
          const tempDate = mFromDate.add(1, 'day').format('YYYY-MM-DD');
          if (i < range) {
            markedDatesCopy[tempDate] = {
              color: colors.themeColor,
              textColor: colors.basicLightText,
              // customStyles: {
              // container: {
              // justifyContent: 'flex-end',
              // alignItems: 'flex-end',
              // textAlign: "right",
              // },
              // text: {
              // textAlign: "right",
              // alignSelf: 'flex-end',
              // },
              // },
            };
          } else {
            markedDatesCopy[tempDate] = {
              endingDay: true,
              selected: true,
              color: colors.themeColor,
              textColor: colors.basicLightText,
            };
          }
        }
      }
    }
    return [markedDatesCopy, range];
  };

  getCalendarConfig = () => {
    const { calendarRange } = this.state;
    let calendarConfig;

    switch (calendarRange) {
      case 'current': {
        calendarConfig = {
          minDate: moment(),
          maxDate: moment(),
          pastScrollRange: 0,
          futureScrollRange: 1,
        };
        // minDate
        // maxDate
        break;
      }
      case 'upcoming': {
        calendarConfig = {
          minDate: moment().add(1, 'day'),
          maxDate: moment().add(6, 'months'),
          pastScrollRange: 0,
          futureScrollRange: 1,
        };
        break;
      }
      case 'past': {
        calendarConfig = {
          minDate: moment().subtract(1, 'day'),
          maxDate: moment().subtract(6, 'months'),
          pastScrollRange: 1,
          futureScrollRange: 0,
        };
        break;
      }
      default: {
        calendarConfig = {
          minDate: undefined,
          maxDate: undefined,
          pastScrollRange: 0,
          futureScrollRange: 1,
        };
      }
    }

    const [markedDates] = this.setupMarkedDates(calendarConfig.minDate, calendarConfig.maxDate);

    return this.setState({
      markedDates,
    });
  };

  setCalendar = calendarRange => {
    const isCurrent = calendarRange === 'current';

    this.setState({
      isFromDatePicked: isCurrent,
      isToDatePicked: isCurrent,
      markedDates: isCurrent ? {} : {},
      calendarRange,
    });
  };

  applyChanges = () => {
    const { navigation } = this.props;
    const { fromDate, toDate, isFromDatePicked, isToDatePicked } = this.state;

    const updateReduxStore = navigation.getParam('onApply', () => {});

    const dates = [isFromDatePicked && fromDate, isToDatePicked && toDate].filter(v => !!v);

    updateReduxStore(dates);
  };

  handleReset = () => {
    this.setState({
      fromDate: null,
      toDate: null,
      isFromDatePicked: false,
      isToDatePicked: false,
      markedDates: {},
    });
  };

  render() {
    const { selectedDate, fromDate, toDate, markedDates, calendarRange } = this.state;

    LocaleConfig.locales.en = localeDatePicker();
    LocaleConfig.defaultLocale = 'en';

    // const FILLER_HEIGHT = 34;

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.dayNamesContainer}>
          {dayNames().map((dayName, index) => (
            <Text key={index} style={styles.dayNameText}>
              {dayName}
            </Text>
          ))}
        </View>
        <ScrollView
          style={styles.containter}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
        >
          <Calendar
            {...this.props}
            // key={this.state}
            ref={ref => (this.calendarRef = ref)}
            style={{
              flex: 1,
            }}
            theme={{
              selectedDayBackgroundColor: colors.themeColor,
              textMonthFontFamily: fontFamily.gothamMedium,
              textDayFontFamily: fontFamily.gothamMedium,
              textMonthFontSize: fontSize.large,
              textDayFontSize: fontSize.large,
              'stylesheet.day.period': {
                wrapper: {
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                },
                base: {
                  width: 38,
                  height: 34,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                },
                text: {
                  fontSize: fontSize.large,
                  alignSelf: 'center',
                },
              },
            }}
            current={fromDate}
            // pastScrollRange={1}
            // futureScrollRange={1}
            firstDay={1}
            markedDates={markedDates}
            onDayPress={day => this.onDayPress(day)}
            hideDayNames
            markingType="period"
            // markingType={'custom'}
            // {...calendarConfig}
          />
        </ScrollView>
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => this.getCalendarConfig('current')}>
            <Text style={styles.buttonText}>{i18n.t('filters.current')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.getCalendarConfig('upcoming')}
          >
            <Text style={styles.buttonText}>{i18n.t('filters.upcoming')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginRight: 0 }]}
            onPress={() => this.getCalendarConfig('past')}
          >
            <Text style={styles.buttonText}>{i18n.t('filters.past')}</Text>
          </TouchableOpacity>
        </View> */}
        <View>
          {Boolean(fromDate) && (
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText}>
                {moment(fromDate).format('DD/MM/YYYY')}
                {Boolean(toDate) && ` - ${moment(toDate).format('DD/MM/YYYY')}`}
              </Text>
            </View>
          )}
        </View>
        <ConfirmButtons
          confirmLabel={i18n.t('generic.buttons.apply')}
          cancelLabel={i18n.t('generic.buttons.reset')}
          handleSave={this.applyChanges}
          handleCancel={() => this.handleReset()}
          closeOnCancel={false}
        />
      </View>
    );
  }
}

export default DateRangeFilter;
