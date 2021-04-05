import { StyleSheet } from 'react-native';
import { fontFamily, fontSize, fontColor } from '../../constants/fonts';
import colors from '../../constants/colors';

const buttonSize = 35;

export default StyleSheet.create({
  container: { marginBottom: 10 },
  imageContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#eee',
    marginBottom: 5,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    bottom: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: fontSize.large,
    color: fontColor.basicLight,
    fontFamily: fontFamily.gothamBold,
    marginBottom: 10,
  },
  addressContainer: {
    flexDirection: 'row',
  },
  address: {
    fontSize: fontSize.regular,
    color: fontColor.basicLight,
    fontFamily: fontFamily.gothamBold,
  },
  menuContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    margin: 0,
    padding: 0,
    borderRadius: buttonSize / 2,
    textAlign: 'center',
    lineHeight: buttonSize,
    backgroundColor: colors.backgroundLight,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    marginBottom: 5,
  },
  filterItem: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 3,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  filterItemActive: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    // TODO: replace the color with a constant
    borderBottomColor: colors.menuActiveTab,
    borderBottomWidth: 3,
  },
  filterLabel: {
    fontSize: fontSize.medium,
    color: fontColor.basicDark,
    fontFamily: fontFamily.gothamBold,
  },
  venueItem: {},
  searchField: {
    position: 'absolute',

    top: 10,
    left: 16,
    right: 16,

    height: 40,

    paddingTop: 9,
    paddingBottom: 7,
    paddingLeft: 16,
    paddingRight: 16,

    fontFamily: fontFamily.gothamMedium,
    fontSize: 14,
    color: '#202873',

    textAlign: 'left',

    backgroundColor: '#ffffff',

    borderWidth: 1,
    borderColor: '#8C9091',

    borderRadius: 3,
  },
  searchFieldList: {
    height: 40,

    marginTop: 10,
    marginBottom: 16,
    marginLeft: 1,
    marginRight: 1,

    paddingTop: 9,
    paddingBottom: 7,
    paddingLeft: 16,
    paddingRight: 16,

    fontFamily: fontFamily.gothamMedium,
    fontSize: 14,
    color: '#202873',

    textAlign: 'left',

    backgroundColor: '#ffffff',

    borderWidth: 1,
    borderColor: '#8C9091',

    borderRadius: 3,
  },
  featuredContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
    minWidth: 96,
    height: 24,
  },
  featuredBox: {
    borderTopLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
    paddingLeft: 12,
    paddingRight: 3,
    height: 24,
  },
  featured: {
    color: colors.headingBasic,
    fontSize: fontSize.small,
    fontFamily: fontFamily.gothamBold,
    textTransform: 'uppercase',
  },
});
