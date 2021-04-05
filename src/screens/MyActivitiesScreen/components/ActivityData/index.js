import React, { Fragment } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import Icon from '../../../../components/Icon';
import { fontSize } from '../../../../constants/fonts';
import styles from './styles';
import colors from '../../../../constants/colors';
import { ssaEventActivityType } from '../../../../constants/socialSportsActivity';
import i18n from '../../../../../i18n';
import FA5Icons from 'react-native-vector-icons/FontAwesome5';

const ActivityData = ({
  sports,
  creatorName,
  price,
  numberOfParticipants,
  activityType,
  participantsLevel,
  venue,
  date,
  isCreatedByUser,
  navigation,
  id,
}) => {
  const {
    getIcon,
    iconLibraries: { fontAwesome, materialIcons, fontAwesome5 },
  } = Icon;

  const params = {
    size: 12,
    color: colors.basicText,
  };

  const formattedDate = moment(date).format('hh:mm A DD MMM YYYY');

  return (
    <Fragment>
      <Text style={styles.title}>{sports} </Text>

      <View style={styles.lineContainer}>
        <Text style={[styles.lineText, { marginLeft: 0 }]}>
          {i18n.t('activities.organizer')} {creatorName}
        </Text>
      </View>

      <View style={styles.lineContainer}>
        <View>
          {getIcon(fontAwesome, 'map-marker', { ...params, color: colors.brandColorBright })}
        </View>
        <Text style={[styles.lineText]}>{venue}</Text>
      </View>
      <View style={[styles.lineContainer]}>
        <View>
          {getIcon(fontAwesome, 'calendar', { ...params, color: colors.brandColorBright })}
        </View>
        <Text style={[styles.lineText]}>{formattedDate}</Text>
      </View>

      {false && isCreatedByUser ? (
        <TouchableOpacity
          style={[styles.lineContainer, styles.invitationLink]}
          onPress={() =>
            navigation.navigate('SsaEventDetailsScreen', { params: { id, isCreatedByUser } })
          }
        >
          <View style={styles.linkTitleContainer}>
            <View>{getIcon(fontAwesome, 'group', params)}</View>
            <Text style={styles.lineText}>{`Participants ${numberOfParticipants}`}</Text>
          </View>
          {getIcon(fontAwesome, 'chevron-right', params)}
        </TouchableOpacity>
      ) : (
        <View style={styles.lineContainer}>
          <View>{getIcon(fontAwesome, 'group', params)}</View>
          <Text style={styles.lineText}>{`Participants ${numberOfParticipants}`}</Text>
        </View>
      )}
      <View style={styles.lineContainer}>
        <View>{getIcon(fontAwesome, 'exclamation', params)}</View>
        <Text style={styles.lineText}>{`Participants Level: ${participantsLevel}`}</Text>
      </View>

      <View style={styles.lineContainer}>
        <View>{getIcon(materialIcons, 'group', params)}</View>
        <Text style={styles.lineText}>{ssaEventActivityType[activityType]}</Text>
      </View>
      {false && (
        <View style={styles.lineContainer}>
          <View>{getIcon(fontAwesome5, 'money-bill-wave', params)}</View>
          <Text style={styles.lineText}>{`Payment: ${price}`}</Text>
        </View>
      )}
    </Fragment>
  );
};

ActivityData.propTypes = {
  isCreatedByUser: PropTypes.bool,
  sports: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  numberOfParticipants: PropTypes.number.isRequired,
  activityType: PropTypes.string.isRequired,
  participantsLevel: PropTypes.string.isRequired,
  venue: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
};

ActivityData.defaultProps = {
  hasLinkToInvitation: false,
  isCreatedByUser: false,
};

export default withNavigation(ActivityData);
