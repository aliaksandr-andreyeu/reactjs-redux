import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import _ from 'lodash';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import AppleHealthKit from 'rn-apple-healthkit';
import moment from 'moment';

import styles from './styles';

import Tabs from '../../components/UI/Tabs';
import HealthReportRow from './Row';
import DateSwitcher from './DateSwitcher';
import i18n from '../../../i18n';

const tabs = [
  i18n.t('healthReport.day'),
  i18n.t('healthReport.week'),
  i18n.t('healthReport.month'),
];

const isIOS = Platform.OS == 'ios';

const getDatesBasedOnTab = (tabIndex, currentDates) => {
  switch (tabIndex) {
    case 0:
      return {
        ...currentDates,
        startDate: currentDates.today.clone().startOf('day'),
        endDate: currentDates.today.clone().endOf('day'),
      };
    case 1:
      return {
        ...currentDates,
        startDate: currentDates.today.clone().startOf('week'),
        endDate: currentDates.today.clone().endOf('week'),
      };
    case 2:
      return {
        ...currentDates,
        startDate: currentDates.today.clone().startOf('month'),
        endDate: currentDates.today.clone().endOf('month'),
      };
    default:
      return currentDates;
  }
};

const formatTimeBasedOnTab = (tabIndex, dates) => {
  switch (tabIndex) {
    case 0:
      return dates.today.format('MMM DD, YYYY');
    case 1:
      return `${dates.startDate.format('MMM DD')} - ${dates.endDate.format('MMM DD, YYYY')}`;
    case 2:
      return dates.today.format('MMM YYYY');
    default:
      return '';
  }
};

let isAuthorized = false;

const HealthReport = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [dates, changeDates] = useState({
    today: moment().startOf('day'),
    startDate: moment().startOf('day'),
    endDate: moment().endOf('day'),
  });

  const [distance, setDistance] = useState(0);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weight, setWeight] = useState(0);

  // console.log(`${dates.startDate.format('DD.MM.YYYY')} ${dates.endDate.format('DD.MM.YYYY')}`)

  const getIOSData = () => {
    // console.log('getIOSData');

    // console.log('*******************************************************************');
    // console.log('startDate: ', dates.startDate.toISOString());
    // console.log('endDate: ', dates.endDate.toISOString());

    AppleHealthKit.getDailyStepCountSamples(
      {
        startDate: dates.startDate.toISOString(),
        endDate: dates.endDate.toISOString(),
      },
      (err, res) => {
        if (err) {
          setSteps(0);
          console.log('Steps ERROR', err);
          return;
        }
        let steps =
          res && res.length > 0
            ? res.reduce((acc, obj) => {
                let item = obj && obj.value ? obj.value : 0;
                return acc + item;
              }, 0)
            : 0;
        setSteps(parseInt(steps, 10) ? parseInt(steps, 10) : 0);
        // console.log('Steps', res);
      }
    );

    AppleHealthKit.getDailyDistanceWalkingRunningSamples(
      {
        startDate: dates.startDate.toISOString(),
        endDate: dates.endDate.toISOString(),
      },
      (err, res) => {
        if (err) {
          setDistance(0);
          console.log('Distance ERROR', err);
          return;
        }
        let distance =
          res && res.length > 0
            ? res.reduce((acc, obj) => {
                let item = obj && obj.value ? obj.value : 0;
                return acc + item;
              }, 0)
            : 0;
        let dKM = distance ? distance / 1000 : 0;
        setDistance(parseInt(dKM * 100, 10) ? parseInt(dKM * 100, 10) / 100 : 0);
        // console.log('Distance', res);
      }
    );

    AppleHealthKit.getActiveEnergyBurned(
      {
        startDate: dates.startDate.toISOString(),
        endDate: dates.endDate.toISOString(),
      },
      (err, res) => {
        if (err) {
          setCalories(0);
          console.log('Calories ERROR', err);
          return;
        }
        let calories =
          res && res.length > 0
            ? res.reduce((acc, obj) => {
                let item = obj && obj.value ? obj.value : 0;
                return acc + item;
              }, 0)
            : 0;
        setCalories(parseInt(calories, 10) ? parseInt(calories, 10) : 0);
        // console.log('Calories', res);
      }
    );

    AppleHealthKit.getWeightSamples(
      {
        startDate: dates.startDate.toISOString(),
        endDate: dates.endDate.toISOString(),
      },
      (err, res) => {
        if (err) {
          setWeight(0);
          console.log('Weight ERROR', err);
          return;
        }
        let weight =
          res && res.length > 0
            ? res.reduce((acc, obj) => {
                let item = obj && obj.value ? obj.value : 0;
                return acc + item;
              }, 0)
            : 0;
        let dKG = weight ? (weight / (res && res.length > 0 ? res.length : 1)) * 0.453592 : 0;
        setWeight(parseInt(dKG * 100, 10) ? parseInt(dKG * 100, 10) / 100 : 0);
        // console.log('Weight', res);
      }
    );
  };

  const getAndroidData = () => {
    // console.log('getAndroidData');

    // console.log('*******************************************************************');
    // console.log('startDate: ', dates.startDate.toISOString());
    // console.log('endDate: ', dates.endDate.toISOString());

    GoogleFit.getDailyStepCountSamples({
      startDate: dates.startDate.toISOString(), // required ISO8601Timestamp
      endDate: dates.endDate.toISOString(), // required ISO8601Timestamp
    })
      .then(res => {
        let stepsObj =
          res && res.length > 0
            ? res.find((item, i) => item.source === 'com.google.android.gms:estimated_steps')
            : {};
        let steps =
          stepsObj.steps && stepsObj.steps.length > 0
            ? stepsObj.steps.reduce((accumulator, obj) => {
                let item = obj && obj.value ? obj.value : 0;
                return item + accumulator;
              }, 0)
            : 0;
        setSteps(parseInt(steps, 10) ? parseInt(steps, 10) : 0);
        // console.log('Steps RES:', res);
        // console.log('stepsObj: ', stepsObj);
        // console.log('Steps:', steps);
      })
      .catch(err => {
        setSteps(0);
        console.log('Steps ERROR', err);
      });

    GoogleFit.getDailyDistanceSamples(
      {
        startDate: dates.startDate.toISOString(),
        endDate: dates.endDate.toISOString(),
      },
      (err, res) => {
        if (err) {
          setDistance(0);
          console.log('Distance ERROR', err);
          return;
        }
        let distance =
          res && res.length > 0
            ? res.reduce((accumulator, obj) => {
                let item = obj && obj.distance ? obj.distance : 0;
                return item + accumulator;
              }, 0)
            : 0;
        let dKM = distance ? distance / 1000 : 0;
        setDistance(parseInt(dKM * 100, 10) ? parseInt(dKM * 100, 10) / 100 : 0);
        // console.log('Distance RES: ', res);
        // console.log('Distance: ', distance);
        // console.log('Distance dKM: ', parseInt(dKM * 100, 10) / 100);
      }
    );

    GoogleFit.getDailyCalorieSamples(
      {
        startDate: dates.startDate.toISOString(),
        endDate: dates.endDate.toISOString(),
        basalCalculation: true, // optional, to calculate or not basalAVG over the week
      },
      (err, res) => {
        if (err) {
          setCalories(0);
          console.log('Calories ERROR', err);
          return;
        }
        let calories =
          res && res.length > 0
            ? res.reduce((accumulator, obj) => {
                let item = obj && obj.calorie ? obj.calorie : 0;
                return item + accumulator;
              }, 0)
            : 0;
        setCalories(parseInt(calories, 10) ? parseInt(calories, 10) : 0);
        // console.log('Calories RES: ', res);
        // console.log('Calories: ', calories);
      }
    );

    GoogleFit.getWeightSamples(
      {
        unit: 'kg',
        startDate: dates.startDate.toISOString(), // required
        endDate: dates.endDate.toISOString(), // required
        ascending: false, // optional; default false
      },
      (err, res) => {
        if (err) {
          setWeight(0);
          console.log('Weight ERROR', err);
          return;
        }
        let weight =
          res && res.length > 0
            ? res.reduce((acc, obj) => {
                let item = obj && obj.value ? obj.value : 0;
                return item + acc;
              }, 0)
            : 0;
        let dKG = weight ? weight / (res && res.length > 0 ? res.length : 1) : 0;
        setWeight(parseInt(dKG * 100, 10) ? parseInt(dKG * 100, 10) / 100 : 0);
        // console.log('Weight RES: ', res);
        // console.log('Weight: ', weight);
      }
    );
  };

  const initIOSData = () => {
    // console.log('initIOSData');

    if (!isAuthorized) {
      let options = {
        permissions: {
          read: ['ActiveEnergyBurned', 'Weight', 'StepCount', 'Steps', 'DistanceWalkingRunning'],
          write: [],
        },
      };
      AppleHealthKit.initHealthKit(options, (err, res) => {
        if (err) {
          console.log('AUTH ERROR', err);
        } else {
          // console.log('AUTH SUCCESS', res);
          isAuthorized = true;
          getIOSData();
        }
      });
    } else {
      getIOSData();
    }
  };

  const initAndroidData = () => {
    // console.log('initAndroidData');

    if (!isAuthorized) {
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          // Scopes.FITNESS_ACTIVITY_READ_WRITE,
          Scopes.FITNESS_BODY_READ,
          // Scopes.FITNESS_BODY_READ_WRITE,
          Scopes.FITNESS_LOCATION_READ,
        ],
      };
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            // console.log('AUTH SUCCESS', authResult);
            isAuthorized = true;
            getAndroidData();
          }
        })
        .catch(err => {
          console.log('AUTH ERROR', err);
        });
    } else {
      getAndroidData();
    }
  };

  useEffect(() => {
    // console.log('isIOS', isIOS);

    isIOS ? initIOSData() : initAndroidData();
  }, [dates]);

  const onNextDatePress = () => {
    switch (activeTabIndex) {
      case 0:
        changeDates({
          today: dates.today.add(1, 'd'),
          startDate: dates.today.clone().startOf('day'),
          endDate: dates.today.clone().endOf('day'),
        });
        break;
      case 1:
        changeDates({
          today: dates.today.add(7, 'd'),
          startDate: dates.today.clone().startOf('week'),
          endDate: dates.today.clone().endOf('week'),
        });
        break;
      case 2:
        changeDates({
          today: dates.today.add(1, 'M'),
          startDate: dates.today.clone().startOf('month'),
          endDate: dates.today.clone().endOf('month'),
        });
        break;
      default:
        break;
    }
  };
  const onPrevDatePress = () => {
    switch (activeTabIndex) {
      case 0:
        changeDates({
          today: dates.today.subtract(1, 'd'),
          startDate: dates.today.clone().startOf('day'),
          endDate: dates.today.clone().endOf('day'),
        });
        break;
      case 1:
        changeDates({
          today: dates.today.subtract(7, 'd'),
          startDate: dates.today.clone().startOf('week'),
          endDate: dates.today.clone().endOf('week'),
        });
        break;
      case 2:
        changeDates({
          today: dates.today.subtract(1, 'M'),
          startDate: dates.today.clone().startOf('month'),
          endDate: dates.today.clone().endOf('month'),
        });
        break;
      default:
        break;
    }
  };

  const onTabPress = tabIndex => {
    setActiveTabIndex(tabIndex);
    changeDates(getDatesBasedOnTab(tabIndex, dates));
  };

  return (
    <View>
      <Tabs currentTab={activeTabIndex} tabs={tabs} onPress={onTabPress} isActivity />
      <DateSwitcher
        date={formatTimeBasedOnTab(activeTabIndex, dates)}
        onLeftArrowPress={onPrevDatePress}
        onRightArrowPress={onNextDatePress}
      />
      <View>
        <Text style={styles.title}>{i18n.t('healthReport.activity')}</Text>
        <HealthReportRow
          title={i18n.t('healthReport.distance_km')}
          value={distance ? distance.toString() : '0'}
          iconName="running"
        />
        <HealthReportRow
          title={i18n.t('healthReport.steps')}
          value={steps ? steps.toString() : '0'}
          iconName="shoe-prints"
        />
        <HealthReportRow
          title={i18n.t('healthReport.calories')}
          value={calories ? calories.toString() : '0'}
          iconName="fire-alt"
        />
        <HealthReportRow
          title={i18n.t('healthReport.weight')}
          value={weight ? weight.toString() : '0'}
          iconName="weight"
        />
      </View>
    </View>
  );
};

export default HealthReport;
