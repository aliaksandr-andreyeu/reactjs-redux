import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import Icons from '../../../../components/Icons'
import colors from '../../../../constants/colors'
import ErrorMessage from '../../../../components/ErrorMessage'
import i18n from '../../../../../i18n'

class SsaScreen extends Component {
  renderIcon = color => {
    const { iconName } = this.props

    switch (iconName) {
      case 'medal': {
        return <Icons.FontAwesome5 size={18} color={color} name="medal" />
      }
      case 'group': {
        return <Icons.FontAwesome size={18} color={color} name="group" />
      }
      case 'ticket': {
        return <Icons.FontAwesome size={18} color={color} name="ticket" />
      }
      case 'calendar': {
        return <Icons.FontAwesome size={18} color={color} name="calendar" />
      }
      case 'clock-o': {
        return <Icons.FontAwesome size={18} color={color} name="clock-o" />
      }
      case 'money-bill-wave': {
        return <Icons.FontAwesome5 size={18} color={color} name="money-bill-wave" />
      }
      case 'credit-card': {
        return <Icons.FontAwesome5 size={18} color={color} name="credit-card" />
      }
      case 'map-marker': {
        return <Icons.FontAwesome size={18} color={color} name="map-marker" />
      }
      case 'level-up': {
        return <Icons.FontAwesome size={18} color={color} name="level-up" />
      }
      case 'star': {
        return <Icons.FontAwesome size={18} color={color} name="star-o" />
      }
      default: {
        return <Icons.FontAwesome5 size={18} color={color} name="globe" />
      }
    }
  }

  render() {
    const {
      style,
      label,
      value,
      valueIcon,
      onPress,
      error,
      errorMessage,
      isDisabled,
      isDisabledActive,
      withDropdown
    } = this.props

    return (
      <View>
        <TouchableOpacity
          onPress={isDisabled ? (isDisabledActive ? onPress : () => false) : onPress}
          style={{
            ...styles.container,
            ...style,
            ...(withDropdown && { marginBottom: 0 }),
            ...(isDisabled && styles.disabled),
            ...(error && { borderColor: colors.errorMain }),
            flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
          }}
        >
          <View
            style={{
              ...styles.titleSection,
              flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
              alignItems: 'center'
            }}
          >
            {this.renderIcon(isDisabled ? colors.basicText : colors.themeColor)}
            <Text
              style={{
                ...styles.title,
                marginLeft: i18n.locale.toLowerCase() == 'en' ? 10 : 0,
                marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 10
              }}
            >
              {label}
            </Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={[styles.value, valueIcon && { marginRight: 15 }]} ellipsizeMode="tail" numberOfLines={1}>
              {value ? value : ''}
            </Text>
            {valueIcon}
          </View>
        </TouchableOpacity>
        {error && errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </View>
    )
  }
}

SsaScreen.propTypes = {
  style: ViewPropTypes.style,
  iconName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  isDisabled: PropTypes.bool,
  isDisabledActive: PropTypes.bool,
  valueIcon: PropTypes.element,
  withDropdown: PropTypes.bool
}

SsaScreen.defaultProps = {
  style: {},
  isDisabled: false,
  isDisabledActive: false,
  valueIcon: null,
  withDropdown: false
}

export default SsaScreen
