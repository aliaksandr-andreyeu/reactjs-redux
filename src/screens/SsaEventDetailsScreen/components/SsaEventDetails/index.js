import React, { Fragment } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import propTypes from 'prop-types';
import Icon from '../../../../components/Icon';
import { fontSize } from '../../../../constants/fonts';
import styles from './styles';
import colors from '../../../../constants/colors';
import {
  getSsaPlayerLevel,
  getSsaEventActivityType,
} from '../../../../helpers/socialSportsActivity';

const ActivityData = ({ event }) => {
  const {
    getIcon,
    iconLibraries: { fontAwesome, materialIcons },
  } = Icon;

  const params = {
    size: fontSize.medium,
    color: colors.basicText,
  };

  const formattedDate = moment(event.StartDateTime).format('hh:mm A DD MMM YYYY');

  return (
    <Fragment>
      <Text style={styles.title}>Social sport activity</Text>
      <View style={styles.lineContainer}>
        {getIcon(fontAwesome, 'map-marker', { ...params, color: colors.brandColorBright })}
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={[styles.lineText, styles.locationText]}
        >{`${event.Venue.Title} - ${event.Facility.Title}`}</Text>
      </View>
      <View style={[styles.lineContainer, styles.dateContainer]}>
        {getIcon(fontAwesome, 'calendar', { ...params, color: colors.basicLightText })}
        <Text style={[styles.lineText, styles.dateText]}>{formattedDate}</Text>
      </View>
      <View style={styles.lineContainer}>
        {getIcon(materialIcons, 'group', params)}
        <Text style={styles.lineText}>{getSsaEventActivityType(event.ActivityType)}</Text>
      </View>
      <View style={styles.lineContainer}>
        {getIcon(fontAwesome, 'exclamation', params)}
        <Text style={styles.lineText}>{`Participants Level: ${getSsaPlayerLevel(
          event.PlayerLevel
        )}`}</Text>
      </View>
    </Fragment>
  );
};

ActivityData.propTypes = {
  event: propTypes.shape({
    StartDateTime: propTypes.string.isRequired,
    ActivityType: propTypes.number.isRequired,
    PlayerLevel: propTypes.number.isRequired,
    Venue: propTypes.shape({
      Title: propTypes.string.isRequired,
    }).isRequired,
    Facility: propTypes.shape({
      Title: propTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ActivityData;
