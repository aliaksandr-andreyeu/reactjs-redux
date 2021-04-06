import React, { Component } from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import { getCardImage } from './helpers'
import styles from './styles'
import i18n from '../../../../../i18n'

import Logo from '../../../../assets/images/icons/dxb-logo.svg'

class PaymentMethodItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // onPress = () => {};

  render() {
    const { item, onPress, isBalance } = this.props

    return (
      <TouchableOpacity
        onPress={() => onPress(item.id, Boolean(isBalance))}
        style={{
          ...styles.container,
          flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
        }}
      >
        {isBalance ? <Logo height={28} width={46} /> : getCardImage(item.brand)}
        <Text
          style={{
            ...styles.label,
            textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
          }}
        >
          {isBalance ? i18n.t('payment.dxb_balance') : i18n.t('payment.ending_in').replace('*', item.last4)}
        </Text>
      </TouchableOpacity>
    )
  }
}

export default PaymentMethodItem
