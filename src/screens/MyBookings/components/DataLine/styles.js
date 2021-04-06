import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontFamily, fontSize } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  lineText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: colors.basicText,
    marginLeft: 10
  }
})

export default styles
