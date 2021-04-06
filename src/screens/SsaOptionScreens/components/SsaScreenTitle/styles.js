import { StyleSheet } from 'react-native'
import { fontSize, fontFamily } from '../../../../constants/fonts'
import colors from '../../../../constants/colors'

const styles = StyleSheet.create({
  screenTitle: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.lightTitleText,
    marginVertical: 15
  }
})

export default styles
