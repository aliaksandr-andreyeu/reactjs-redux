import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontSize, fontFamily } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  text: {
    color: colors.basicText,
    fontSize: fontSize.medium,
    fontFamily: fontFamily.gothamMedium
  },
  disableText: {
    color: colors.disabledText
  },
  boldText: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.large
  },
  contentWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    paddingRight: 50
  },
  counterWrapper: {
    alignSelf: 'center'
  }
})

export default styles
