import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import DateTag from '../DateTag';

const VenueDetailsListItem = ({ withDate, tagLabel, onPress, title, imageUri, date }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.boxShadow} elevation={5}>
      <ImageBackground
        source={{ uri: imageUri }}
        style={[styles.background, { zIndex: 2 }]}
        resizeMode="cover"
      >
        <View style={[styles.topSection, withDate && styles.containerWithDate]}>
          {withDate && <DateTag date={date} />}
          <View style={styles.tagContainer}>
            <Text style={styles.tag}>{tagLabel}</Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{title}</Text>
        </View>
      </ImageBackground>
    </View>
  </TouchableOpacity>
);

VenueDetailsListItem.propTypes = {
  withDate: PropTypes.bool,
  tagLabel: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  imageUri: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

VenueDetailsListItem.defaultProps = {
  withDate: false,
};

export default VenueDetailsListItem;
