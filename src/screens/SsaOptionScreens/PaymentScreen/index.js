import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { View, Text, TextInput } from 'react-native';
import RadioButton from '../../../components/UI/RadioButton';
import handleNumericInputBlur from '../../../helpers/handleNumericInputBlur';
import SsaScreenTitle from '../components/SsaScreenTitle';
import styles from './styles';
import { paymentOptions } from './constants';
import * as actions from '../../SsaMainScreen/actions';
import layoutConfig from '../../../constants/layout';
import ConfirmButtons from '../../../components/UI/ConfirmButtons';
import i18n from '../../../../i18n';

class PaymentScreen extends PureComponent {
  state = {
    selectedItem: this.props.payment,
    specifiedAmount: '',
  };

  handleSelect = index => {
    const { selectedItem } = this.state;

    if (index !== selectedItem) {
      this.setState({
        selectedItem: index,
      });
    }
  };

  handleTextChange = text => {
    if (!isNaN(+text)) {
      this.setState({
        specifiedAmount: text,
      });
    }
  };

  handleBlur = () => {
    const { specifiedAmount } = this.state;

    this.setState({
      specifiedAmount: handleNumericInputBlur(specifiedAmount),
    });
  };

  render() {
    const { specifiedAmount, selectedItem } = this.state;
    const { updateStore } = this.props;

    return (
      <View style={styles.container}>
        <View style={{ paddingHorizontal: layoutConfig.mainContainer.sidePadding }}>
          <SsaScreenTitle text={i18n.t('socialSportsActivity.payment')} />
          <View>
            <RadioButton
              label={paymentOptions[0]}
              isSelected={selectedItem === 0}
              handleSelect={() => this.handleSelect(0)}
            />
            <View style={styles.inputOption}>
              <View style={{ justifyContent: 'center' }}>
                <RadioButton
                  label={paymentOptions[1]}
                  isSelected={selectedItem === 1}
                  handleSelect={() => this.handleSelect(1)}
                  style={{}}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  keyboardType="numeric"
                  value={specifiedAmount}
                  onChangeText={this.handleTextChange}
                  onBlur={this.handleBlur}
                  style={styles.input}
                />
                <Text style={styles.currencyLabel}>AED</Text>
              </View>
            </View>
          </View>
        </View>

        <ConfirmButtons
          confirmLabel={i18n.t('generic.buttons.apply')}
          cancelLabel={i18n.t('generic.buttons.clear')}
          handleSave={() => updateStore({ payment: selectedItem })}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  payment: state.socialSportActivity.payment,
});
const mapDispatchToProps = {
  updateStore: actions.setData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentScreen);
