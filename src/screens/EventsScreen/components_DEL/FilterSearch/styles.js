import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontSize, fontFamily } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.brandColorBright,
    flexDirection: 'row',

    alignItems: 'center'
  },
  iconContainer: {
    width: 30
  },
  input: {
    paddingLeft: 15,
    paddingRight: 30,
    backgroundColor: colors.brandColorBright,
    fontSize: fontSize.medium,
    fontFamily: fontFamily.gothamMedium,
    color: colors.basicLightText,
    borderRadius: 5,
    flex: 1
  },
  focusedInput: {
    backgroundColor: colors.backgroundLight,
    color: colors.basicText
  },
  icon: {
    position: 'absolute',
    right: 25
  }
})

export default styles
