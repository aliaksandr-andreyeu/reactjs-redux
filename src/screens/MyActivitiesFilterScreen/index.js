import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RadioButton from '../../components/UI/RadioButton';
import i18n from '../../../i18n';
import styles from './styles';

const radioOptions = [i18n.t('filters.today'), i18n.t('filters.upcoming'), i18n.t('filters.past')];

class MyActivitiesFilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      dateRange: '',
      selectedOption: 0,
    };
  }

  handleSelect = () => {};

  render() {
    const { selectedOption, category, dateRange } = this.state;

    return (
      <View>
        <View>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionLabel}>{i18n.t('filters.category')}</Text>
            <Text style={[styles.selectedOption, !category && styles.initialValue]}>—</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionLabel}>{i18n.t('filters.daterange')}</Text>
            <Text style={[styles.selectedOption, !dateRange && styles.initialValue]}>—</Text>
          </TouchableOpacity>
        </View>
        {radioOptions.map((option, index) => (
          <RadioButton
            key={option}
            label={option}
            handleSelect={this.handleSelect}
            isSelected={index === selectedOption}
          />
        ))}
      </View>
    );
  }
}

export default MyActivitiesFilterScreen;
