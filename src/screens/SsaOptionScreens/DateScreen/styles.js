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
    alignItems: 'center'
  },
  selectedDateText: {
    color: colors.basicLightText,
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.extraLarge
  }
})

export default styles
