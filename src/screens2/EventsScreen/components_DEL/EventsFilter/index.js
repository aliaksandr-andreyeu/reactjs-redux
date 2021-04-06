import React, { Component } from 'react'
import { View } from 'react-native'
import styles from './styles'
import FilterOption from '../FilterOption'
import i18n from '../../../../../i18n'

class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        <FilterOption name={i18n.t('filters.category_of_sports')} targetScreen="CreateSsaScreen" />
        <FilterOption name={i18n.t('filters.daterange')} targetScreen="CreateSsaScreen" />
      </View>
    )
  }
}

export default index
