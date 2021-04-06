import React from 'react'
import { SafeAreaView, FlatList, TouchableOpacity, Text } from 'react-native'
import { withNavigation } from 'react-navigation'
import BookingListItem from '../BookingListItem'
import styles from './styles'
import MyBookingTab from '../MyBookingTab'
import i18n from '../../../../../i18n'

const MyCart = props => {
  const { data, navigation } = props

  return (
    <SafeAreaView style={styles.container}>
      <MyBookingTab type="cart" data={data} message={i18n.t('messages.empty_cart')} />
      {!!data.length && (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.buttonText}>{i18n.t('bookings.proceed_to_checkout')}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

export default withNavigation(MyCart)
