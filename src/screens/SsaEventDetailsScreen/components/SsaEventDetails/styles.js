import { StyleSheet } from 'react-native'
import { fontSize, fontFamily } from '../../../../constants/fonts'
import colors from '../../../../constants/colors'

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.large,
    fontFamily: fontFamily.gothamBold,
    marginBottom: 20
  },
  lineContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  dateContainer: {
    height: 30,
    left: -15,
    paddingLeft: 30,
    alignSelf: 'flex-start',
    alignItems: 'center',
    minWidth: 190,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: colors.brandColorBright
  },
  locationText: {
    color: colors.brandColorBright,
    fontSize: fontSize.regular + 2
  },
  dateText: {
    color: colors.basicLightText
  },
  lineText: {
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.gothamMedium,
    marginLeft: 10
  }
})

export default styles
