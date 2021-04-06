import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList, Image, Text, TouchableHighlight, TouchableOpacity } from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import moment from 'moment'
import { connect } from 'react-redux'

import { apiUrls, axiosInstance } from '../../constants/api'
import { NavHeaderUser } from '../../components/NavHeaderUser'
import i18n from '../../../i18n'
import colors from '../../constants/colors'
import styles from './styles'
import { fontFamily, fontSize } from '../../constants/fonts'
import { getCart } from './actions'

import Global from '../../components/global'

const Cart = ({ navigation, cart, getCart }) => {
  useEffect(() => {
    getCart()
  }, [])

  const removeItem = itemId => {
    axiosInstance
      .delete(`${apiUrls.deleteCartItem}/${itemId}`)
      .then(getCart)
      .catch(e => console.warn(e))
  }

  const clearCart = () => {
    axiosInstance.delete(apiUrls.clearCart).then(getCart).catch(console.warn)
  }

  const checkName = () => {
    let firstName = Global.user && Boolean(Global.user.firstName) ? Global.user.firstName.toString().trim() : ''
    let lastName = Global.user && Boolean(Global.user.lastName) ? Global.user.lastName.toString().trim() : ''

    if (Boolean(firstName) && Boolean(lastName)) {
      navigation.navigate('Payment')
    } else {
      navigation.navigate('PaymentNameCheck')
    }
  }

  const renderItem = ({ Title, DateTime, Price, Currency, ImageUrl, OrderItemId }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: ImageUrl }} style={styles.itemImage} />

      <View style={styles.itemDataContainer}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {Title}
        </Text>

        <EvilIcons name="trash" size={20} style={styles.trashIcon} onPress={() => removeItem(OrderItemId)} />

        <View style={styles.itemDateContainer}>
          <EvilIcons name="calendar" size={20} style={styles.itemDateIcon} />
          <Text style={styles.itemDate}>{moment(DateTime).format('DD MMM yyyy')}</Text>
        </View>
        <Text style={styles.itemPrice}>
          {Currency} {Price}
        </Text>
      </View>
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.secondaryBackgroundLight }}>
      {cart.length ? (
        <FlatList
          data={cart}
          renderItem={({ item }) => renderItem(item)}
          style={styles.listContainer}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.noItemsContainer}>
          <Image source={require('../../assets/images/cart.png')} />
          <Text style={styles.noItemsText}>{i18n.t('events.no_items_in_cart')}</Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.buttonConfirm,
              height: 60,
              width: '90%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              marginTop: 30
            }}
            onPress={() => navigation.navigate('BookingsList')}
          >
            <Text
              style={{
                color: '#fff',
                fontFamily: fontFamily.gothamMedium,
                fontSize: fontSize.medium
              }}
            >
              {i18n.t('nav.bookings')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {cart.length ? (
        <View style={styles.buttonsContainer}>
          <TouchableHighlight onPress={clearCart} style={styles.clearAllButton}>
            <Text style={styles.clearAllButtonText}>{i18n.t('generic.buttons.clear_all').toUpperCase()}</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={cart.length ? () => checkName() : null} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>{i18n.t('generic.buttons.next').toUpperCase()}</Text>
          </TouchableHighlight>
        </View>
      ) : null}
    </View>
  )
}

Cart.navigationOptions = ({ navigation }) => {
  return {
    headerRight: <NavHeaderUser {...navigation} />,
    title: i18n.t('events.your_cart')
  }
}

export default connect(
  state => ({
    cart: state.cart
  }),
  {
    getCart
  }
)(Cart)
