import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontFamily, fontSize } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brandColorBright,
    marginRight: 15
  },
  selectedContainer: {
    backgroundColor: colors.brandColorBright
  },
  text: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.large - 2,
    color: colors.basicText
  },
  selectedText: {
    color: colors.basicLightText
  }
})

export default styles
