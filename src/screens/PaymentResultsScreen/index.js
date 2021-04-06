import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import styles from './styles'
import colors from '../../constants/colors'
import i18n from '../../../i18n'
import { NavHeaderUser } from '../../components/NavHeaderUser'

export default class PaymentResultsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavHeaderUser {...navigation} />
    }
  }

  //i18n.t('events.your_payment_of_aed_was_successfully_completed').replace('*', amountToPay)

  getConfig = (isSuccess, amountToPay) => {
    return {
      statusColor: isSuccess ? colors.brandColorBright : colors.errorText,
      paymentStatus: isSuccess ? i18n.t('events.payment_is_succesful') : i18n.t('events.payment_failed'),
      bodyText: isSuccess
        ? i18n.t('events.your_payment_of_aed_was_successfully_completed')
        : i18n.t('events.your_payment_was_not_proceed_succesfully_your_credit_card_was_not_charged_please_try_again'),
      buttonText: isSuccess ? 'Go to Home' : 'Try again'
    }
  }

  render() {
    const { navigation } = this.props

    const { isSuccess, amountToPay } = navigation.getParam('data', {})

    const config = this.getConfig(isSuccess, amountToPay)

    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text
            style={{
              ...styles.text,
              color: config.statusColor,
              marginBottom: 15,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
            }}
          >
            {config.paymentStatus}
          </Text>
          <Text
            style={{
              ...styles.text,
              ...styles.content,
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
            }}
          >
            {config.bodyText}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={
              isSuccess
                ? () => {
                    // navigation.replace('More');
                    navigation.navigate('Home')
                  }
                : () => navigation.goBack()
            }
          >
            <Text style={[styles.text, styles.buttonText]}>{i18n.t('events.ok')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
