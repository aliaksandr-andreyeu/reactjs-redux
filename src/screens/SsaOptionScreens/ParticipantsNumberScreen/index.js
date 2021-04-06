import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import styles from './styles'
import SsaScreenTitle from '../components/SsaScreenTitle'
import handleNumericInputBlur from '../../../helpers/handleNumericInputBlur'
import layoutConfig from '../../../constants/layout'
import * as actions from '../../SsaMainScreen/actions'
import ConfirmButtons from '../../../components/UI/ConfirmButtons'
import i18n from '../../../../i18n'

class ParticipantsNumberScreen extends PureComponent {
  state = {
    inputValue: String(this.props.numberOfParticipants)
  }

  increase = () => {
    const { inputValue } = this.state

    this.setState({
      inputValue: String(+inputValue + 1)
    })
  }

  decrease = () => {
    const { inputValue } = this.state

    if (+inputValue > 0) {
      this.setState({
        inputValue: String(+inputValue - 1)
      })
    }
  }

  handleChange = text => {
    if (!isNaN(+text)) {
      this.setState({
        inputValue: text
      })
    }
  }

  handleBlur = () => {
    const { inputValue } = this.state

    this.setState({
      inputValue: handleNumericInputBlur(inputValue)
    })
  }

  render() {
    const { inputValue } = this.state
    const { updateStore } = this.props

    return (
      <View style={styles.container}>
        <View style={{ paddingHorizontal: layoutConfig.mainContainer.sidePadding }}>
          <SsaScreenTitle text={i18n.t('socialSportsActivity.players_number')} />
          <View style={styles.innerWrapper}>
            <View style={styles.counterWrapper}>
              <TouchableOpacity style={[styles.button, styles.buttonLeft]} onPress={this.decrease}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                onChangeText={this.handleChange}
                onBlur={this.handleBlur}
                value={inputValue}
                keyboardType="numeric"
              />
              <TouchableOpacity style={[styles.button, styles.buttonRigth]} onPress={this.increase}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ConfirmButtons
          confirmLabel={i18n.t('generic.buttons.apply')}
          cancelLabel={i18n.t('generic.buttons.clear')}
          handleSave={() => updateStore({ numberOfParticipants: +inputValue })}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  numberOfParticipants: state.socialSportActivity.numberOfParticipants
})
const mapDispatchToProps = {
  updateStore: actions.setData
}

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantsNumberScreen)
