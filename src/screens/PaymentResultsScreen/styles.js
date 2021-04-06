import { StyleSheet } from 'react-native'
import colors from '../../constants/colors'
import { fontFamily, fontSize } from '../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 15
  },
  contentWrapper: {},
  text: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.large,
    color: colors.basicText
  },
  button: {
    height: 50,
    backgroundColor: colors.brandColorBright,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: colors.basicLightText
  }
})

export default styles
