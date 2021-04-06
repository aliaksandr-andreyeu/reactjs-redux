import React, { Component } from 'react'

import { View, FlatList } from 'react-native'

import ListItem from './ListItem'

import styles from './styles'

import isEqual from 'lodash.isequal'

export default class Accordion extends Component {
  state = {
    currentIndex: undefined
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props, prevProps)) {
    }
  }

  onChange(value) {
    this.setState({
      currentIndex: value
    })
  }

  render() {
    const { faq } = this.props
    const { currentIndex } = this.state

    return faq && faq.length > 0 ? (
      <View style={styles.faqBox}>
        <FlatList
          data={faq}
          extraData={this.props}
          renderItem={({ item, index }) => {
            return (
              <ListItem
                item={item}
                index={index}
                onChange={value => this.onChange(value)}
                currentIndex={currentIndex}
              />
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    ) : null
  }
}
