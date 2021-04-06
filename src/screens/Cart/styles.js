import { StyleSheet } from 'react-native'
import colors from '../../constants/colors'
import { fontFamily, fontSize } from '../../constants/fonts'

export default StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 15,
    borderRadius: 10,
    borderColor: colors.borderLight,
    borderWidth: 1,
    backgroundColor: colors.backgroundLight,
    height: 125
  },
  itemImage: {
    flex: 1.5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  itemDataContainer: {
    flex: 3,
    paddingTop: 5,
    paddingHorizontal: 12
  },
  trashIcon: {
    position: 'absolute',
    right: 10,
    top: 7,
    color: 'red'
  },
  itemTitle: {
    color: colors.brandColorBright,
    fontSize: fontSize.submedium,
    height: 50,
    fontFamily: fontFamily.gothamMedium,
    marginRight: 20
  },
  itemDateContainer: {
    flexDirection: 'row',
    marginTop: 7,
    alignItems: 'center'
  },
  itemDateIcon: {
    marginTop: -3,
    marginLeft: -4
  },
  itemDate: {
    fontSize: fontSize.regular,
    color: colors.basicBorder,
    fontFamily: fontFamily.gothamMedium
  },
  itemPrice: {
    fontSize: fontSize.medium,
    marginTop: 7,
    color: colors.brandColorBright,
    fontFamily: fontFamily.gothamMedium
  },
  listContainer: {
    marginTop: 5
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10
  },
  noItemsText: {
    fontSize: fontSize.regular,
    fontFamily: fontFamily.gothamMedium,
    marginTop: 60
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10
  },
  clearAllButton: {
    height: 45,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    marginRight: 5
  },
  clearAllButtonText: {
    color: '#fff',
    fontSize: fontSize.large,
    fontFamily: fontFamily.gothamMedium
  },
  nextButton: {
    height: 45,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brandColorBright,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  nextButtonText: {
    color: '#fff',
    fontSize: fontSize.large,
    fontFamily: fontFamily.gothamMedium
  }
})
