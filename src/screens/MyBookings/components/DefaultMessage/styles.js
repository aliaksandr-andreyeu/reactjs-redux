import { StyleSheet } from 'react-native'
import { fontFamily, fontSize } from '../../../../constants/fonts'
import colors from '../../../../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: colors.textBasic,
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.medium
  }
})

export default styles
