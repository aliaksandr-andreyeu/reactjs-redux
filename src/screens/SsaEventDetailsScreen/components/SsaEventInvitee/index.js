import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import propTypes from 'prop-types'
import Icon from '../../../../components/Icon'
import styles from './styles'
import { fontSize } from '../../../../constants/fonts'
import colors from '../../../../constants/colors'
import { SsaEventParticipationStatus } from '../../../../constants/socialSportsActivity'
import { axiosInstance, apiUrls } from '../../../../constants/api'

import MoreIcon from '../../../../assets/images/icons/icon_user.svg'

class SsaEventInvitee extends Component {
  approveRequest = () => {
    const { updateParticipantsList, participant } = this.props

    axiosInstance
      .post(apiUrls.postApproveJoin(participant.Code))
      .then(res => {
        console.log(res)
        updateParticipantsList()
      })
      .catch(err => {
        console.log(err)
        console.log(err.request)
      })
  }

  declineRequest = () => {
    const { updateParticipantsList, participant } = this.props

    axiosInstance
      .post(apiUrls.postDeclineJoin(participant.Code))
      .then(() => updateParticipantsList())
      .catch(err => {
        console.log(err)
        console.log(err.request)
      })
  }

  render() {
    const {
      isCurrentUserHost,
      participant: { Participant, ParticipationStatus }
    } = this.props

    const FullName = Participant && Participant.FullName ? Participant.FullName : ''
    const ImageThumbURL = Participant && Participant.ImageThumbURL ? Participant.ImageThumbURL : ''

    const {
      getIcon,
      iconLibraries: { fontAwesome }
    } = Icon

    const isApproved = ParticipationStatus === SsaEventParticipationStatus.JoinRequestApproved
    const isDeclined = ParticipationStatus === SsaEventParticipationStatus.JoinRequestDeclined
    const isSent = ParticipationStatus === SsaEventParticipationStatus.JoinRequestSent

    let isImage = false
    if (ImageThumbURL && ImageThumbURL.length > 0) {
      isImage = true
    }

    // console.log('participant', participant)
    // console.log('***************************************************************************')

    return Participant ? (
      <View style={styles.container}>
        <View style={styles.contactDetailsContainer}>
          {isImage ? (
            <Image
              style={styles.contactImage}
              source={{
                uri: ImageThumbURL
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                ...styles.contactImage,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.tabIconDefault,
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <MoreIcon height={32} width={32} />
            </View>
          )}

          <View
            style={{
              ...styles.contactDetails,
              justifyContent: 'center'
            }}
          >
            <Text style={styles.contactName}>{FullName}</Text>
            {/*
              <Text style={styles.contactLevel}>Intermediate</Text>
            */}
          </View>
        </View>

        {isCurrentUserHost ? (
          isSent ? (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={this.approveRequest}>
                {getIcon(fontAwesome, 'check', {
                  size: fontSize.medium,
                  color: '#089293'
                })}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.declineButton]} onPress={this.declineRequest}>
                {getIcon(fontAwesome, 'close', { size: fontSize.medium, color: '#F92D4F' })}
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[styles.status, isApproved ? styles.approved : styles.declined, { minWidth: 40, height: 50 }]}>
              {/*isApproved ? 'Approved' : 'Declined'*/}
            </Text>
          )
        ) : null}
      </View>
    ) : null
  }
}

SsaEventInvitee.propTypes = {
  isCurrentUserHost: propTypes.bool,
  participant: propTypes.shape({
    Participant: propTypes.shape({
      FullName: propTypes.string,
      ImageThumbURL: propTypes.string
    }),
    ParticipationStatus: propTypes.isRequired,
    Code: propTypes.string.isRequired
  }).isRequired,
  updateParticipantsList: propTypes.func.isRequired
}

export default SsaEventInvitee
