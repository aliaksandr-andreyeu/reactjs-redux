import React, { Component } from 'react';
import { Text, Image, View, ImageBackground, Dimensions } from 'react-native';
import styles from './styles';
import i18n from '../../../../../i18n';

class BookingListItem extends Component {
  render() {
    const { item, children } = this.props;

    console.log(item);
    return (
      <View style={[styles.container, styles.boxShadow]} elevation={5}>
        <ImageBackground
          source={{ uri: item.ImageUrl }}
          style={styles.background}
          resizeMode="cover"
        >
          <View
            style={{
              alignSelf: 'center',
              justifySelf: 'flex-end',
              padding: 10,
              backgroundColor: 'rgb(19,148,138)',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={styles.priceText}>
              {`${item.Currency || i18n.t('generic.aed')} ${item.Price}`}
            </Text>
          </View>
        </ImageBackground>
        <View style={styles.contentWrapper}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.title]}>
            {item.Title}
          </Text>
          {children}
        </View>
      </View>
    );
  }
}

export default BookingListItem;
