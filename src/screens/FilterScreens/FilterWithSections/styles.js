import { StyleSheet } from 'react-native'
import colors from '../../../constants/colors'
import { fontSize, fontFamily } from '../../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryBgColor,
    justifyContent: 'space-between',
    flex: 1
  },
  innerWrapper: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8
  },
  sectionContainer: {
    paddingHorizontal: 15
  },
  sectionHeader: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.large,
    color: colors.textBasic,
    marginBottom: 15
  },
  filterContainer: {
    borderBottomColor: colors.borderLight,
    borderBottomWidth: 1,
    marginBottom: 5,
    paddingTop: 10
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  itemName: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.textBasic
  },
  checkBox: {
    borderWidth: 1,
    borderColor: colors.borderDarker,
    height: 25,
    width: 25,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    backgroundColor: colors.brandColorBright
  }
})

export default styles
