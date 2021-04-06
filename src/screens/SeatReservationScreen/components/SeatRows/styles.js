import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontFamily, fontSize } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  rowNumber: {
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: fontFamily.gothamMedium,
    color: colors.basicText,
    fontSize: fontSize.large
  }
})

export default styles
