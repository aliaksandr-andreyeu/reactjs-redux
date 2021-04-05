import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5';
import { fontFamily } from '../../../constants/fonts';

const iconsSize = 17;

const DateSwitcher = ({ date, onLeftArrowPress, onRightArrowPress }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 0,
      }}
    >
      <TouchableOpacity
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}
        onPress={onLeftArrowPress}
      >
        <FontAwesomeIcons name="chevron-left" size={iconsSize} />
      </TouchableOpacity>
      <Text style={{ fontFamily: fontFamily.gothamMedium, fontSize: 18 }}>{date}</Text>
      <TouchableOpacity
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
        }}
        onPress={onRightArrowPress}
      >
        <FontAwesomeIcons name="chevron-right" size={iconsSize} />
      </TouchableOpacity>
    </View>
  );
};

DateSwitcher.propTypes = {
  date: PropTypes.string.isRequired,
  onLeftArrowPress: PropTypes.func.isRequired,
  onRightArrowPress: PropTypes.func.isRequired,
};

export default DateSwitcher;
