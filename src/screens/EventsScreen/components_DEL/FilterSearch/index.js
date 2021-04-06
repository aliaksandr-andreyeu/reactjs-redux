import React, { Component, createRef } from 'react'
import { View, TextInput } from 'react-native'
import propTypes from 'prop-types'
import styles from './styles'
import colors from '../../../../constants/colors'
import Icon from '../../../../components/Icon'

class FilterSearch extends Component {
  state = {
    inputText: '',
    isFocused: false
  }

  textInputRef = React.createRef()

  handleFocus = () => {
    this.setState({
      isFocused: true
    })
  }

  handleBlur = () => {
    this.setState({
      isFocused: false
    })
  }

  onChangeText = text => {
    const { onChange } = this.props

    this.setState(
      {
        inputText: text
      },
      () => onChange(text)
    )
  }

  render() {
    const { inputText, isFocused } = this.state
    const { placeholder } = this.props

    return (
      <View style={styles.container}>
        {/* Add wrapper around Input to implement padding for loupe */}
        <TextInput
          ref={this.textInputRef}
          style={[styles.input, isFocused && styles.focusedInput]}
          placeholderTextColor={isFocused ? colors.placeholderText : colors.basicLightText}
          onChangeText={this.onChangeText}
          value={inputText}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={placeholder}
        />
        <View style={styles.icon}>
          {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'search', {
            size: 20,
            color: isFocused ? colors.basicText : colors.basicLightText
          })}
        </View>
      </View>
    )
  }
}

FilterSearch.propTypes = {
  placeholder: propTypes.string,
  onChange: propTypes.func
}

FilterSearch.defaultProps = {
  placeholder: 'Search',
  onChange: () => false
}

export default FilterSearch
