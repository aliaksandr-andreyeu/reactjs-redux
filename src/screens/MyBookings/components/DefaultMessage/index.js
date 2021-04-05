import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

const DefaultMessage = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

export default DefaultMessage;
