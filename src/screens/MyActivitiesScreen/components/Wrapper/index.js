import React from 'react';
import { View } from 'react-native';
import styles from './styles';

const Activity = ({ children }) => {
  return (
    <View style={[styles.container]} elevation={0}>
      {children}
    </View>
  );
};

export default Activity;
