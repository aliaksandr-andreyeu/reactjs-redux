import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../../../constants/colors'
import { fontSize, fontFamily } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  text: {
    color: colors.basicText,
    fontSize: fontSize.large,
    fontFamily: fontFamily.gothamMedium
  },
  boldText: {
    fontFamily: fontFamily.gothamBold
  },
  paddedWrapper: {
    paddingHorizontal: 15
  },
  catsWrapper: {
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    borderRadius: 5
  }
})

export default styles
