import { StyleSheet } from 'react-native'
import colors from '../../../constants/colors'
import { fontFamily, fontSize } from '../../../constants/fonts'
import layoutConfig from '../../../constants/layout'

const styles = StyleSheet.create({
  innerWrapper: {
    paddingHorizontal: layoutConfig.mainContainer.sidePadding
  },
  input: {
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: layoutConfig.mainContainer.sidePadding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 0.5,
    marginBottom: 10
  },
  facilitiesText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.basicText
  }
})

export default styles
