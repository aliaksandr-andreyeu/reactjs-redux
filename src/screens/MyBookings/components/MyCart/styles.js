import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontFamily, fontSize } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brandColorBright,
    paddingVertical: 10,
    borderRadius: 5
  },
  buttonText: {
    color: colors.basicLightText,
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium
  }
})

export default styles
