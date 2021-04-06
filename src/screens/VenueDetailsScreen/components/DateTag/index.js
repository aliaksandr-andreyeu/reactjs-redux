import React from 'react'
import { View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import moment from 'moment'
import styles from './styles'
import colors from '../../../../constants/colors'

const parseDate = ({ date }) => {
  return moment(date).format('DD-MMM-YYYY').split('-')
}

const DateTag = ({ date }) => {
  if (!date) {
    return null
  }

  const parsedDate = parseDate(date)

  return (
    <View style={styles.dateContainer}>
      <LinearGradient
        colors={[colors.backgroundLight, 'transparent']}
        start={[0.2, 0.5]}
        end={[1, 0.5]}
        style={styles.dateGradient}
      >
        <Text style={styles.date}>{parsedDate[0]}</Text>
        <Text style={styles.date}>{parsedDate[1]}</Text>
        <Text style={styles.date}>{parsedDate[2]}</Text>
      </LinearGradient>
    </View>
  )
}

export default DateTag
