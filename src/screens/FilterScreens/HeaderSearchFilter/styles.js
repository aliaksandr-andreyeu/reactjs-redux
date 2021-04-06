import { StyleSheet } from 'react-native'
import colors from '../../../constants/colors'
import { fontSize, fontFamily } from '../../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBgColor,
    justifyContent: 'space-between'
  },
  innerWrapper: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: colors.backgroundLight,
    borderRadius: 10
  },
  optionContainer: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: colors.borderLight,
    borderBottomWidth: 1
  },
  optionText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.basicLightText
  }
})

export default styles
