import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const SsaSectionTitle = props => (
  <Text style={styles.text} {...props}>
    {props.text}
  </Text>
);

SsaSectionTitle.propTypes = {
  text: PropTypes.string.isRequired,
};

export default SsaSectionTitle;
