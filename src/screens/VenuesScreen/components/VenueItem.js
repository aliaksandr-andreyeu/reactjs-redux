import React, { Fragment, PureComponent } from 'react'
import { Image, View, Text, Platform } from 'react-native'
import PropTypes from 'prop-types'
import { withNavigation } from 'react-navigation'
import styles from '../styles'
import VenueMenu from './VenueMenu'
import colors from '../../../constants/colors'
import { fontSize, fontFamily } from '../../../constants/fonts'
import { axiosInstance, apiUrls } from '../../../constants/api'
import Icon from '../../../components/Icon'
import SkewedContainer from '../../../components/SkewedContainer'

import Global from '../../../components/global'

import i18n from '../../../../i18n'

export const VENUE_ITEM_HEIGHT = 120
export const VENUE_ITEM_MARGIN_BOTTOM = 10

class VenueItem extends PureComponent {
  state = {
    isBookmarked: false,
    isSignedInUser: false,

    linesNum: 0
  }

  setTitleLines = e => {
    let eLines = e.nativeEvent.layout.height
    if (eLines !== undefined) {
      this.setState({
        linesNum: eLines <= 48 ? 2 : 1
      })
    }
  }

  // getDescription = desc => {
  // const { linesNum } = this.state;
  // if (desc == undefined) return null;
  // if (linesNum == 0) return null;
  // return linesNum > 0 ? (
  // <Text
  // ellipsizeMode="tail"
  // numberOfLines={linesNum}
  // style={{
  // marginTop: 8,
  // color: colors.textBasic,
  // fontSize: fontSize.regular,
  // fontFamily: fontFamily.gothamMedium,
  // lineHeight: fontSize.regular + 6,
  // textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right',
  // }}
  // >
  // {desc}
  // </Text>
  // ) : null;
  // };

  async componentDidMount() {
    const {
      venue: { Id }
    } = this.props
    const { isSignedInUser } = this.state

    if (isSignedInUser) {
      axiosInstance(apiUrls.getBookmarks).then(({ data }) => {
        this.setState({
          isBookmarked: !!data.find(item => item.EntityName.toLowerCase() === 'venue' && item.Eid === Id)
        })
      })
    }
  }

  toggleBookmark = () => {
    const { isBookmarked } = this.state
    const {
      venue: { Id }
    } = this.props

    const params = {
      Id,
      Entity: 'venue'
    }

    if (isBookmarked) {
      axiosInstance.post(apiUrls.postRemoveBookmark, params).then(() => {
        this.setState(() => ({
          isBookmarked: false
        }))
      })
    } else {
      axiosInstance.post(apiUrls.postAddBookmark, params).then(() => {
        this.setState(() => ({
          isBookmarked: true
        }))
      })
    }
  }

  render() {
    const {
      venue: { ImageThumbUrl, Title, FullAddress, Description, IsFeatured }
    } = this.props
    const { isBookmarked, linesNum } = this.state

    const isSignedInUser = Boolean(Global.user && Global.user.token && Global.user.token.length > 5)

    const { getIcon, iconLibraries } = Icon

    return (
      <View
        style={{
          backgroundColor: colors.backgroundLight,
          borderRadius: 10,
          marginBottom: VENUE_ITEM_MARGIN_BOTTOM,
          flexDirection: 'row',
          overflow: 'hidden',
          // height: VENUE_ITEM_HEIGHT,
          height: 120
        }}
        // onLayout={event => console.log(event.nativeEvent.layout.height)}
      >
        <Image
          style={{
            width: 128,
            // height: 120,
            height: 120,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10
          }}
          resizeMode="cover"
          source={{ uri: ImageThumbUrl }}
        />
        {IsFeatured && (
          <View style={styles.featuredContainer}>
            <SkewedContainer backgroundColor={colors.orangeBackground} rightSkewType="asc" width={24} height={24}>
              <View style={styles.featuredBox}>
                <Text style={styles.featured}>Featured</Text>
              </View>
            </SkewedContainer>
          </View>
        )}
        <View style={{ paddingLeft: 8, paddingRight: 16, paddingVertical: 8, flex: 1 }}>
          <View
            style={{
              flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
              justifyContent: 'space-between',
              marginBottom: 9
            }}
          >
            <Text
              onLayout={e => this.setTitleLines(e)}
              numberOfLines={3}
              style={{
                color: colors.featureColor1,
                fontSize: fontSize.regular,
                fontFamily: fontFamily.gothamBold,
                lineHeight: fontSize.regular + 10,
                textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                // flexBasis: 'auto',
                // flexGrow: 0,
                // flexShrink: 1,
              }}
            >
              {Title}
            </Text>
            {/*isSignedInUser && (
              <View
                style={{
                  flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                  flexGrow: 0,
                  flexShrink: 0,
                  flexBasis: 'auto',
                  marginTop: 5,
                  marginLeft: 5,
                }}
              >
                {getIcon(iconLibraries.fontAwesome, isBookmarked ? 'star' : 'star-o', {
                  size: fontSize.small,
                  color: colors.featureColor1,
                })}
              </View>
            )*/}
          </View>
          {FullAddress && (
            <View
              style={{
                flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              <View
                style={{
                  marginTop: 2
                }}
              >
                {getIcon(iconLibraries.fontAwesome5, 'map-marker-alt', {
                  size: fontSize.small,
                  color: colors.darkIcon
                })}
              </View>
              <Text
                ellipsizeMode="tail"
                numberOfLines={linesNum}
                style={{
                  color: colors.textBasic,
                  fontSize: fontSize.regular,
                  marginLeft: 8,
                  fontFamily: fontFamily.gothamMedium,
                  lineHeight: fontSize.regular + 8,
                  marginLeft: i18n.locale.toLowerCase() == 'en' ? 8 : 0,
                  marginRight: i18n.locale.toLowerCase() == 'en' ? 0 : 8,
                  textAlign: i18n.locale.toLowerCase() == 'en' ? 'left' : 'right'
                }}
              >
                {FullAddress}
              </Text>
            </View>
          )}
          {/*this.getDescription(Description)*/}
        </View>
      </View>
    )
  }
}

VenueItem.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  borderRadius: PropTypes.number,
  venue: PropTypes.shape({
    ImageUrl: PropTypes.string,
    LanguageCode: PropTypes.string,
    Id: PropTypes.number.isRequired,
    Title: PropTypes.string.isRequired,
    FullAddress: PropTypes.string,
    ContactNo: PropTypes.string,
    ImageThumbUrl: PropTypes.string.isRequired,
    ImageAltText: PropTypes.string,
    GeoLatitude: PropTypes.number,
    GeoLongitude: PropTypes.number
  }).isRequired
}

VenueItem.defaultProps = {
  borderRadius: 0
}

export default withNavigation(VenueItem)
