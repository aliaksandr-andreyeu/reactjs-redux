import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import ActivityData from '../ActivityData';
import Wrapper from '../Wrapper';
import styles from './styles';
import NewButton from '../../../../components/UI/NewButtonComponent';
import i18n from '../../../../../i18n';

class Activity extends Component {
  state = {};

  switchToSsa = mode => {
    const { navigation, id, showLoading } = this.props;

    const data = this.getInitParams(mode);

    navigation.navigate('CreateSsaMain', { data, id });

    showLoading();
  };

  getInitParams = screenMode => {
    // end
    const {
      title,
      desc,
      numberOfParticipants,
      sportCategoryId,
      startDate,
      endDate,
      venueId,
      facilityId,
      packageId,
      activityTypeNum,
      participantsLevelNum,
      image,
    } = this.props;

    switch (screenMode) {
      case 'edit':
        return {
          title,
          desc,
          sportCategoryId: sportCategoryId.toString(),
          date: startDate.slice(0, 10),
          startTime: startDate.slice(11, 16),
          endTime: endDate.slice(11, 16),
          venueId: venueId.toString(),
          facilityId: facilityId.toString(),
          packageId: packageId.toString(),
          numberOfParticipants,
          playerLevel: participantsLevelNum,
          payment: 0,
          activityType: activityTypeNum,
          image,
          screenMode,
        };
      case 'clone':
        return {
          title,
          desc,
          sportCategoryId: sportCategoryId.toString(),
          playerLevel: 0,
          numberOfParticipants,
          payment: 0,
          activityType: 0,
          screenMode,
        };
      default:
        return {};
    }
  };

  render() {
    const {
      navigation,
      id,
      creatorName,
      isCreatedByUser,
      deleteEvent,
      isMyActivity,
      image,
    } = this.props;

    // console.log('this.props', this.props)

    return (
      <Wrapper>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row' }}
          onPress={() =>
            navigation.navigate('SsaEventDetailsScreen', { params: { id, isCreatedByUser } })
          }
        >
          <View>
            <Image
              style={{
                width: 128,
                height: 184,
                borderTopLeftRadius: 8,
                borderBottomRightRadius: 0,
              }}
              resizeMode="cover"
              source={{ uri: image }}
            />
          </View>
          <View style={{ paddingLeft: 22 }}>
            <ActivityData isCreatedByUser={isCreatedByUser} {...this.props} />
          </View>
        </TouchableOpacity>

        {isCreatedByUser ? (
          <View style={styles.buttonContainer}>
            <NewButton
              buttonStyles={styles.button}
              label={i18n.t('more.cancel')}
              position={'left'}
              onPress={() => deleteEvent(id)}
            />
            <NewButton
              buttonStyles={styles.button}
              label={i18n.t('more.edit')}
              position={'center'}
              onPress={() => this.switchToSsa('edit')}
            />
            <NewButton
              buttonStyles={[styles.button, styles.cancelButton]}
              textStyles={styles.cancelButtonText}
              label={i18n.t('more.clone')}
              position={'right'}
              onPress={() => this.switchToSsa('clone')}
            />
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            {false && (
              <NewButton
                buttonStyles={[styles.button, styles.cancelButton]}
                textStyles={styles.cancelButtonText}
                label={isMyActivity ? 'Your join request has been approved' : 'Request to Join'}
                disabled={isMyActivity}
                position={'single'}
                onPress={() =>
                  navigation.navigate('SsaEventDetailsScreen', { params: { id, isCreatedByUser } })
                }
              />
            )}
            <NewButton
              buttonStyles={[styles.button, styles.cancelButton]}
              textStyles={styles.cancelButtonText}
              label={i18n.t('more.view').toUpperCase()}
              position={'single'}
              onPress={() =>
                navigation.navigate('SsaEventDetailsScreen', { params: { id, isCreatedByUser } })
              }
            />
          </View>
        )}
      </Wrapper>
    );
  }
}

export default withNavigation(Activity);
