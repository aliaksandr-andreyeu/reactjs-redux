import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import propTypes from 'prop-types';
import styles from './styles';
import Icon from '../../../../components/Icon';
import colors from '../../../../constants/colors';

const FilterOption = ({ name, targetScreen, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => navigation.navigate(targetScreen)}
    >
      <Text style={styles.optionText}>{name}</Text>
      {Icon.getIcon(Icon.iconLibraries.fontAwesome, 'chevron-right', {
        size: 18,
        color: colors.basicLightText,
      })}
    </TouchableOpacity>
  );
};

FilterOption.propTypes = {
  name: propTypes.string.isRequired,
  targetScreen: propTypes.string.isRequired,
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(FilterOption);
