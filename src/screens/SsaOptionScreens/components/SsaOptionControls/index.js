import React from 'react'
import { withNavigation } from 'react-navigation'
import { TouchableOpacity, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import i18n from '../../../../../i18n'

const SsaOptionControls = ({ handleSave, navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleSave()
          navigation.goBack()
        }}
      >
        <Text style={styles.buttonText}>{i18n.t('generic.generic.buttons.apply')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>{i18n.t('generic.generic.buttons.cancel')}</Text>
      </TouchableOpacity>
    </View>
  )
}

SsaOptionControls.propTypes = {
  handleSave: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
}

export default withNavigation(SsaOptionControls)
