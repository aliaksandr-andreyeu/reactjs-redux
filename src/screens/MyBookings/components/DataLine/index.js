import { Text, View } from 'react-native';
import React from 'react';
import Icon from '../../../../components/Icon';
import colors from '../../../../constants/colors';
import styles from './styles';

const DataLine = ({ text, icon }) => {
  const { iconLibraries, getIcon } = Icon;
  const iconProps = {
    size: 15,
    color: colors.iconDark,
    ...(icon.style || {}),
  };

  return (
    <View style={styles.lineContainer}>
      {getIcon(iconLibraries[icon.library], icon.name, iconProps)}
      <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.lineText]}>
        {text}
      </Text>
    </View>
  );
};

export default DataLine;
