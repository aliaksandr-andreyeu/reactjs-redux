import { StyleSheet } from 'react-native'
import colors from '../../../constants/colors'
import { fontFamily, fontSize } from '../../../constants/fonts'

const styles = StyleSheet.create({
  dayNamesContainer: {
    height: 66,
    backgroundColor: colors.secondaryBackgroundLight,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  dayNameText: {
    color: colors.basicText
  },
  selectedDateContainer: {
    height: 60,
    backgroundColor: colors.brandColorBright,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  selectedDateText: {
    color: colors.basicLightText,
    fontFamily: fontFamily.gothamMedium,
    fontSize: 24,
    textAlign: 'center',
    alignSelf: 'center'
  },
  buttonContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    marginRight: 15,
    height: 40,
    paddingHorizontal: 17,
    borderWidth: 1,
    borderColor: colors.brandColorBright,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: fontFamily.gothamMedium,
    color: colors.brandColorBright,
    fontSize: fontSize.medium
  }
})

export default styles
