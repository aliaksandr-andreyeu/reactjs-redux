import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import propTypes from 'prop-types'
import styles from './styles'
import Icon from '../../../../components/Icon'
import { orderOptions } from './constants'
import { getArrowColors } from './helpers'

class SortOrderItem extends Component {
  state = {
    orderOption: orderOptions.initial
  }

  handlePress = () => {
    this.setState(({ orderOption }) => ({
      orderOption: orderOption <= orderOptions.asc ? orderOption + 1 : 0
    }))

    // Change Redux store accordingly
  }

  render() {
    const { orderOption } = this.state
    const arrowColors = getArrowColors(orderOption)
    // const {title} = this.props;

    const isSelected = orderOption === orderOptions.asc || orderOption === orderOptions.desc

    return (
      <TouchableOpacity onPress={this.handlePress} style={[styles.container, isSelected && styles.selected]}>
        <Text style={[styles.title, isSelected && styles.selectedTitle]}>Title</Text>
        <View style={styles.arrowsContainer}>
          {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'arrow-up', {
            size: 18,
            color: arrowColors.upArrowColor
          })}
          {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'arrow-down', {
            size: 18,
            color: arrowColors.downArrowColor
          })}
        </View>
      </TouchableOpacity>
    )
  }
}

SortOrderItem.propTypes = {
  title: propTypes.string.isRequired
}

SortOrderItem.defaultProps = {}

export default SortOrderItem
