import React from 'react'
import { SafeAreaView, FlatList } from 'react-native'
import BookingListItem from '../BookingListItem'
import styles from './styles'
import PackageData from '../PackageData'
import SsaData from '../SsaData'
import TicketData from '../TicketData'
import MyCartData from '../MyCartData'
import DefaultMessage from '../DefaultMessage'

const getItemData = (type, item) => {
  switch (type) {
    case 'packages':
      return <PackageData item={item} />
    case 'ssa':
      return <SsaData item={item} />
    case 'tickets':
      return <TicketData item={item} />
    case 'cart':
      return <MyCartData item={item} />
    default:
      return null
  }
}

const MyBookingTab = props => {
  const { data, type, message } = props

  if (message && !data.length) {
    return <DefaultMessage message={message} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <BookingListItem key={index} item={item}>
            {getItemData(type, item)}
          </BookingListItem>
        )}
        keyExtractor={item => item.OrderItemId}
      />
    </SafeAreaView>
  )
}

export default MyBookingTab
