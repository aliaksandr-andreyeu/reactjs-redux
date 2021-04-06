import { StyleSheet } from 'react-native'
import colors from '../../constants/colors'
import { fontFamily, fontSize } from '../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    marginTop: 20
  },
  innerWrapper: {
    paddingHorizontal: 15,
    flex: 1
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: fontSize.medium,
    fontFamily: fontFamily.gothamMedium,
    color: colors.basicText
  },
  inputWrapper: {
    marginBottom: 18
  },
  boxShadow: {
    backgroundColor: colors.backgroundLight,
    marginBottom: 12,
    marginLeft: 7,
    marginRight: 3,
    marginTop: 5,
    shadowColor: colors.shadowDark,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6
  }
})

export default styles
