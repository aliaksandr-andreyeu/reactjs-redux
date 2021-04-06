import React from 'react'
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import Icon from '../../../../components/Icon'
import styles from './styles'
import { fontSize } from '../../../../constants/fonts'
import colors from '../../../../constants/colors'
import i18n from '../../../../../i18n'

const ContactItem = ({ selected, handleSelection, fullName, imageUrl }) => {
  const {
    getIcon,
    iconLibraries: { fontAwesome5 }
  } = Icon

  return (
    <TouchableOpacity onPress={handleSelection} style={styles.contactContainer}>
      <ImageBackground
        source={{
          uri: imageUrl
        }}
        style={styles.imageContainer}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={[styles.imageWrapper, selected && styles.selected]}>
          {selected && getIcon(fontAwesome5, 'check', { size: fontSize.medium, color: colors.iconLigth })}
        </View>
      </ImageBackground>

      <View style={styles.contactTextConatiner}>
        <Text style={[styles.text, styles.contactName]}>{fullName}</Text>
        <Text style={[styles.text, styles.contactLevel]}>{i18n.t('socialSportsActivity.contact_item')}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ContactItem
