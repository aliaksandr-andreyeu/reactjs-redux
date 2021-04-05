import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const ListItem = ({ item }) => {
  const { ImageUrl, FacilityTitle } = item;

  return (
    <TouchableOpacity style={styles.container} onPress={() => false}>
      <View style={styles.boxShadow} elevation={5}>
        <ImageBackground
          source={{ uri: ImageUrl }}
          style={[styles.background, { zIndex: 2 }]}
          resizeMode="cover"
        >
          <View style={[styles.topSection]}>
            <View style={styles.tagContainer}>
              <Text style={styles.tag}>Buy</Text>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{FacilityTitle}</Text>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

// VenueDetailsListItem.propTypes = {
//   withDate: PropTypes.bool,
//   tagLabel: PropTypes.string.isRequired,
//   onPress: PropTypes.func.isRequired,
//   title: PropTypes.string.isRequired,
//   imageUri: PropTypes.string.isRequired,
//   date: PropTypes.string.isRequired,
// };

// ListItem.defaultProps = {
//   withDate: false,
// };

export default ListItem;
