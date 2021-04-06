import React from 'react'
import { Text, View } from 'react-native'
import PropTypes from 'prop-types'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5'

import styles from './styles'

const HealthReportRow = ({ iconName, title, value }) => (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <FontAwesomeIcons name={iconName} size={18} color="#2F8C83" />
      <Text style={styles.title}>{title}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
  </View>
)

HealthReportRow.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired
}

export default HealthReportRow
