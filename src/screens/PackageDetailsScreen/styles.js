import { StyleSheet } from 'react-native'
import colors from '../../constants/colors'
import { fontFamily, fontSize } from '../../constants/fonts'

const styles = StyleSheet.create({
  eventDescription: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: colors.basicText,
    lineHeight: 24,
    marginBottom: 24
  },
  sectionTitle: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.medium,
    color: colors.basicText,
    marginBottom: 15
  },
  sectionContainer: {
    marginBottom: 15
  }
})

export default styles
