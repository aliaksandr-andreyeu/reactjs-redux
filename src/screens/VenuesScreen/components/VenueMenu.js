import React, { Fragment, PureComponent } from 'react'
import { View, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { externalLinks } from '../../../constants/api'
import styles from '../styles'
import colors from '../../../constants/colors'
import openExternalLink from '../../../helpers/openExternalLink'

import i18n from '../../../../i18n'

class VenueMenu extends PureComponent {
  getLocation = () => {
    const {
      coordinates: { GeoLatitude, GeoLongitude }
    } = this.props

    const url = externalLinks.getGoogleMapsUrl(GeoLatitude, GeoLongitude)

    openExternalLink(url)
  }

  get360View = () => {
    const { id } = this.props
    const uri = externalLinks.get360ViewUrl(id)

    this.props.navigation.navigate('View360', { uri })
  }

  render() {
    const { isBookmarked, toggleBookmark } = this.props

    return (
      <Fragment>
        <View
          style={{
            ...styles.menuContainer,
            flexDirection: i18n.locale.toLowerCase() == 'en' ? 'row' : 'row-reverse'
          }}
        >
          <TouchableOpacity style={styles.buttonContainer} onPress={this.get360View}>
            <MaterialIcons name="3d-rotation" size={22} color={colors.lightIcon} style={styles.button} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={this.getLocation}>
            <FontAwesome5Icons name="map-marker-alt" size={22} color={colors.lightIcon} style={styles.button} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={toggleBookmark}>
            <FontAwesomeIcons
              name={isBookmarked ? 'star' : 'star-o'}
              size={22}
              color={colors.lightIcon}
              style={styles.button}
            />
          </TouchableOpacity>
        </View>
      </Fragment>
    )
  }
}

VenueMenu.propTypes = {
  coordinates: PropTypes.objectOf(PropTypes.number).isRequired,
  id: PropTypes.number,
  isBookmarked: PropTypes.bool.isRequired,
  toggleBookmark: PropTypes.func.isRequired
}

export default VenueMenu
