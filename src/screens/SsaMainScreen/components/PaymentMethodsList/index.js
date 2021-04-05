import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import propTypes from 'prop-types';
import colors from '../../../../constants/colors';
import Icon from '../../../../components/Icon';
import getPaymentMethodIcon from '../../../../helpers/getPaymentMethodIcon';
import styles from './styles';
import i18n from '../../../../../i18n';

class PaymentMethodsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addPaymentMethod = () => {
    console.log('Redirecting to ADD PAYMENT screen');
  };

  render() {
    const { paymentMethods, changePaymentMethod } = this.props;

    return (
      <View style={[styles.container, styles.boxShadow]}>
        {paymentMethods.map((method, index) => (
          <TouchableOpacity
            style={styles.methodContainer}
            onPress={() => changePaymentMethod(index)}
          >
            <Text style={styles.methodText}>{`${i18n.t('payment.ending_in')}${method.Last4}`}</Text>
            {getPaymentMethodIcon(method.Scheme)}
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={this.addPaymentMethod} style={styles.addMethodContainer}>
          {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'plus', {
            size: 20,
            color: colors.brandColorBright,
          })}
          <Text style={styles.addMethodText}>{i18n.t('payment.add_new_payment')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

PaymentMethodsList.propTypes = {
  paymentMethods: propTypes.arrayOf({
    Scheme: propTypes.string.isRequired,
    Last4L: propTypes.string.isRequired,
  }).isRequired,
  changePaymentMethod: propTypes.func.isRequired,
};

export default PaymentMethodsList;
