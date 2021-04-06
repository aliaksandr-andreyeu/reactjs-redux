import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontSize } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  buttonWrapper: {
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 5
  },
  buttonText: {
    fontSize: fontSize.regular,
    color: colors.basicLightText,
    backgroundColor: colors.themeColor,
    padding: 4,
    paddingHorizontal: 8
  },
  item: {
    width: 50,
    height: 50,
    borderRadius: 3,
    backgroundColor: colors.backgroundLight,
    marginRight: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  itemText: {
    color: colors.headingBasic,
    fontSize: fontSize.extraSmall,
    alignSelf: 'center'
  }
})

export default styles
