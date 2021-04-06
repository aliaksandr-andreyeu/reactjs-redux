import { Image, StyleSheet } from 'react-native'
import React from 'react'

const styles = StyleSheet.create({
  image: { height: 35, width: 40 }
})

// eslint-disable-next-line import/prefer-default-export
export const getCardImage = brand => {
  switch (brand) {
    case 'Mastercard':
      return (
        <Image
          style={styles.image}
          resizeMode="cover"
          source={require('../../../../assets/images/card_brands/mastercard.png')}
        />
      )
    case 'American Express':
      return (
        <Image
          resizeMode="cover"
          style={styles.image}
          source={require('../../../../assets/images/card_brands/amex.png')}
        />
      )
    case 'Discover':
      return (
        <Image
          resizeMode="cover"
          style={styles.image}
          source={require('../../../../assets/images/card_brands/discover.png')}
        />
      )
    case 'Diners Club International':
      return (
        <Image
          resizeMode="cover"
          style={styles.image}
          source={require('../../../../assets/images/card_brands/dinersclub.png')}
        />
      )
    case 'Visa':
      return (
        <Image
          resizeMode="cover"
          style={styles.image}
          source={require('../../../../assets/images/card_brands/visa.png')}
        />
      )
    case 'JCB':
      return (
        <Image
          resizeMode="cover"
          style={styles.image}
          source={require('../../../../assets/images/card_brands/jcb.png')}
        />
      )
    default:
      return null
  }
}
