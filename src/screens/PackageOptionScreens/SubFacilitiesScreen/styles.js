import { StyleSheet } from 'react-native'
import colors from '../../../constants/colors'
import { fontFamily, fontSize } from '../../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    // backgroundColor: colors.brandColorBright,
    backgroundColor: colors.primaryBgColor
  },
  innerWrapper: {
    padding: 15,
    flexGrow: 1
  },
  item: {
    height: 40,
    borderColor: colors.brandColorBright,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,

    marginBottom: 15,
    paddingHorizontal: 15
  },
  screenTitle: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.large,
    color: colors.textBasic,

    marginBottom: 15
  },
  selected: {
    backgroundColor: colors.brandColorBright
  },
  itemText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.brandColorBright
  },
  itemTextSelected: {
    color: colors.basicLightText
  },
  title: {
    color: colors.basicLightText
  }
})

export default styles
