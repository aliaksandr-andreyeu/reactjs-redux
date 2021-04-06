import { StyleSheet } from 'react-native'
import { fontFamily, fontSize } from '../../../constants/fonts'
import colors from '../../../constants/colors'
import layoutConfig from '../../../constants/layout'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  innerWrapper: {
    paddingHorizontal: layoutConfig.mainContainer.sidePadding
  },
  title: {
    fontSize: fontSize.medium,
    fontFamily: fontFamily.gothamMedium,
    color: colors.lightTitleText
  }
})

export default styles
