import React, { Component } from 'react';
import { View, Text } from 'react-native';
import RadioButton from '../../../../components/UI/RadioButton';
import styles from './styles';
import ConfirmButtons from '../../../../components/UI/ConfirmButtons';

class TicketOption extends Component {
  state = {
    selectedOption: 0,
  };

  getLabel = option => (
    <Text style={[styles.optionContainer]}>
      <Text style={styles.optionText}>{option.title}</Text>
      <Text
        style={[styles.optionText, styles.optionPrice]}
      >{`${option.currency} ${option.price}`}</Text>
    </Text>
  );

  renderOptions = () => {
    const mocked = [
      { id: 0, title: 'Juniors (6-12)', price: 50, currency: 'AED' },
      { id: 1, title: 'Juniors (13-18)', price: 60, currency: 'AED' },
      { id: 2, title: 'Adults (19 +)', price: 80, currency: 'AED' },
    ];

    const { selectedOption } = this.state;

    return mocked.map(option => (
      <RadioButton
        isSelected={option.id === selectedOption}
        label={option.title}
        key={option.id}
        handleSelect={() => this.selectOption(option.id)}
      >
        {this.getLabel(option)}
      </RadioButton>
    ));
  };

  selectOption = id => {
    this.setState({
      selectedOption: id,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.optionsContainer}>{this.renderOptions()}</View>
        <ConfirmButtons />
      </View>
    );
  }
}

export default TicketOption;
