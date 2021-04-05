import React, { Component } from 'react';
import { View, TouchableOpacity, ImageBackground, Text } from 'react-native';
import propTypes from 'prop-types';
import styles from './styles';
import colors from '../../../../../constants/colors';
import { fontSize } from '../../../../../constants/fonts';
import Icon from '../../../../../components/Icon';

class Package extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      handleSelect,
      item: {
        OfferId,
        ImageUrl,
        VenueTitle,
        FacilityTitle,
        DateTimeInfo,
        PriceText,
        Excerpt,
        OfferTitle,
        SportCategory,
        Price,
      },
    } = this.props;

    const { getIcon, iconLibraries } = Icon;

    const params = {
      size: fontSize.medium,
      color: colors.basicText,
    };

    return (
      <View style={styles.boxShadow} elevation={5}>
        <TouchableOpacity onPress={() => handleSelect(OfferId, Price)} style={[styles.container]}>
          <ImageBackground
            style={styles.imageContainer}
            source={{ uri: ImageUrl }}
            resizeMode="cover"
          >
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{SportCategory}</Text>
            </View>
          </ImageBackground>
          <View style={styles.eventDetailsContainer}>
            <Text style={styles.eventTitle}>{OfferTitle}</Text>
            <View style={styles.locationContainer}>
              {getIcon(iconLibraries.fontAwesome5, 'map-marker-alt', {
                ...params,
                size: fontSize.small,
                color: colors.brandColorBright,
              })}
              <Text style={styles.locationName}>{[VenueTitle, FacilityTitle].join(' - ')}</Text>
            </View>
            <View style={styles.dateContainer}>
              {getIcon(iconLibraries.fontAwesome, 'calendar', {
                ...params,
                size: fontSize.regular,
                color: colors.basicLightText,
              })}
              <Text style={styles.dateText}>{DateTimeInfo}</Text>
            </View>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.description}>
              {Excerpt}
            </Text>
            <Text style={styles.priceText}>{PriceText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

Package.propTypes = {
  handleSelect: propTypes.func.isRequired,
  item: propTypes.shape({
    OfferId: propTypes.number.isRequired,
    ImageUrl: propTypes.string.isRequired,
    VenueTitle: propTypes.string.isRequired,
    FacilityTitle: propTypes.string.isRequired,
    DateTimeInfo: propTypes.string.isRequired,
    PriceText: propTypes.string.isRequired,
    Excerpt: propTypes.string.isRequired,
    OfferTitle: propTypes.string.isRequired,
    SportCategory: propTypes.string.isRequired,
  }).isRequired,
};

export default Package;
