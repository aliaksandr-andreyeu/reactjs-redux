import React from 'react';
import { Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import componentStyles from './styles';

const SsaScreenTitle = ({ text, styles }) => (
  <Text style={[componentStyles.screenTitle, styles]}>{text}</Text>
);

SsaScreenTitle.propTypes = {
  text: PropTypes.string.isRequired,
  styles: ViewPropTypes.style,
};

SsaScreenTitle.defaultProps = {
  styles: {},
};

export default SsaScreenTitle;
