import React, { Component } from 'react'
import { View, Text } from 'react-native'
import styles from './styles'
import Counter from '../../../../components/UI/Counter'
import i18n from '../../../../../i18n'

class GaOption extends Component {
  setCounter = value => {
    const { setCounter, category } = this.props

    setCounter({ [category.Id]: value })
  }

  render() {
    const { category, counter, disable } = this.props
    // console.log('disable:', Boolean( disable ) )
    return (
      <View
        style={{
          ...styles.container,
          flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
        }}
      >
        <View
          style={{
            ...styles.contentWrapper,
            paddingRight: i18n.locale.toLowerCase() == 'en' ? 50 : 0,
            paddingLeft: i18n.locale.toLowerCase() == 'en' ? 0 : 50
          }}
        >
          <Text
            style={{
              ...styles.text,
              ...(Boolean(disable) && styles.disableText),
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
            }}
          >
            {category.Title}
          </Text>
          <Text
            style={{
              ...styles.text,
              ...styles.boldText,
              ...(Boolean(disable) && styles.disableText),
              textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
            }}
          >
            {`AED ${category.Price}`}
          </Text>
        </View>
        <View style={styles.counterWrapper}>
          <Counter width={120} counterValue={+counter} setCounter={this.setCounter} disable={Boolean(disable)} />
        </View>
      </View>
    )
  }
}

export default GaOption
