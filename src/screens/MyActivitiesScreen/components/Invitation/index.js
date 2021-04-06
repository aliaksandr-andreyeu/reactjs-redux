import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import propTypes from 'prop-types'
import moment from 'moment'
import ActivityData from '../ActivityData'
import Wrapper from '../Wrapper'
import ButtonComponent from '../../../../components/UI/ButtonComponent'
import styles from './styles'
import colors from '../../../../constants/colors'
import { axiosInstance, apiUrls } from '../../../../constants/api'
import NewButton from '../../../../components/UI/NewButtonComponent'
import i18n from '../../../../../i18n'
import { withNavigation } from 'react-navigation'

class Invitation extends Component {
  state = {}

  handleAccept = () => {
    const { handleInvitation, code } = this.props

    axiosInstance({
      method: 'POST',
      url: apiUrls.postAcceptInvitation(code)
    }).then(() => {
      handleInvitation(code)
    })
  }

  handleDecline = () => {
    const { handleInvitation, code } = this.props

    axiosInstance({
      method: 'POST',
      url: apiUrls.postRejectInvitation(code)
    }).then(() => {
      handleInvitation(code)
    })
  }

  render() {
    const { navigation, id, activityId, creatorName, creationDate, image, isCreatedByUser, fee } = this.props

    return (
      <Wrapper>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row' }}
          onPress={() =>
            navigation.navigate('SsaEventDetailsScreen', {
              params: { id: activityId, isCreatedByUser }
            })
          }
        >
          <View>
            <Image
              style={{
                width: 128,
                height: 184,
                borderTopLeftRadius: 8,
                borderBottomRightRadius: 0
              }}
              resizeMode="cover"
              source={{ uri: image }}
            />
            {fee > 0 && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {i18n.t('activities.aed')} {fee}
                </Text>
              </View>
            )}
          </View>
          <View style={{ paddingLeft: 22 }}>
            <ActivityData {...this.props} />
          </View>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <NewButton
            buttonStyles={styles.button}
            label={i18n.t('activities.decline')}
            buttonType="secondary"
            position={'left'}
            onPress={this.handleDecline}
          />
          <NewButton
            buttonStyles={[styles.button, styles.cancelButton]}
            textStyles={styles.cancelButtonText}
            label={i18n.t('activities.accept')}
            position={'right'}
            buttonType="primary"
            onPress={this.handleAccept}
          />
        </View>
      </Wrapper>
    )
  }
}

Invitation.propTypes = {
  handleInvitation: propTypes.func.isRequired,
  code: propTypes.string.isRequired,
  creatorName: propTypes.string.isRequired,
  image: propTypes.string,
  isCreatedByUser: propTypes.any,
  fee: propTypes.number
}

export default withNavigation(Invitation)
