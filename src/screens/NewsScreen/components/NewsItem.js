import React, { PureComponent } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import moment from 'moment'

import i18n from '../../../../i18n'
import { fontFamily, fontSize } from '../../../constants/fonts'
import colors from '../../../constants/colors'

import styles from '../styles'

import getLocaleDate from '../../../helpers/getLocaleDate'

import env from '../../../config'

export default class NewsItem extends PureComponent {
  state = {
    titleLines: 0
  }

  _getDate = item => {
    let date = getLocaleDate(item)
    return date ? (
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={{
          color: colors.textBasic,
          fontSize: fontSize.small,
          marginLeft: i18n.locale.toLowerCase() == 'en' ? 8 : 0,
          marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 8,
          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
          marginTop: 7,
          fontFamily: fontFamily.gothamMedium,
          lineHeight: fontSize.small + 6,
          textTransform: 'uppercase'
        }}
      >
        {date}
      </Text>
    ) : null
  }

  setTitleLines = e => {
    let eLines = e.nativeEvent.layout.height
    if (eLines !== undefined) {
      this.setState({
        titleLines: eLines <= 48 ? true : false
      })
    }
  }

  getDescription = desc => {
    // const { titleLines } = this.state;
    //return titleLines ? (
    return (
      <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={{
          marginTop: 6,
          color: colors.textBasic,
          fontSize: fontSize.small,
          fontFamily: fontFamily.gothamMedium,
          lineHeight: fontSize.small + 6,
          textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
        }}
      >
        {desc}
      </Text>
    )
  }

  render() {
    const { navigation, item, isBookmarked, isSignedInUser, getIcon, iconLibraries } = this.props

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(`${item.EntityName}Detail`, { id: item.Id, object: item })
        }}
      >
        <View
          // onLayout={event => console.log(event.nativeEvent.layout.height)}
          style={{
            backgroundColor: colors.backgroundLight,
            borderRadius: 10,
            marginBottom: 8,
            flexDirection: 'row',
            height: 146,
            overflow: 'hidden'
          }}
        >
          <View
            style={{
              width: 128,
              height: '100%',
              // height: 120,
              // flex: 1,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10
              // borderWidth: 1,
              // borderColor: "#ffff00",
            }}
          >
            <Image
              style={{
                flex: 1,
                width: 128
                // height: 120,
                // borderWidth: 1,
                // borderColor: "#ff0000",
              }}
              resizeMode="cover"
              source={{ uri: item.ImageSquareThumbURL }}
            />
          </View>
          <View
            style={{
              paddingLeft: 24,
              paddingRight: 21,
              paddingTop: 11,
              paddingBottom: 14,
              flex: 1
            }}
          >
            <View
              style={{
                flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
                // marginBottom: 0,
              }}
            >
              <Text
                ellipsizeMode="tail"
                numberOfLines={3}
                // onLayout={event => console.log(event.nativeEvent.layout.height)}
                onLayout={e => this.setTitleLines(e)}
                style={{
                  color: colors.featureColor2,
                  fontSize: fontSize.regular,
                  fontFamily: fontFamily.gothamBold,
                  lineHeight: fontSize.regular + 10,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                }}
              >
                {item.Title}
              </Text>
            </View>
            <View
              style={{
                flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              {getIcon(iconLibraries.fontAwesome5, 'calendar-alt', {
                size: fontSize.small,
                color: colors.darkIcon
              })}
              {this._getDate(item.PublishedOn)}
            </View>
            {this.getDescription(item.SportCategoryName)}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
