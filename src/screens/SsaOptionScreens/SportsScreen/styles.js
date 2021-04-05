import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import { fontFamily, fontSize } from '../../../constants/fonts';
import layoutConfig from '../../../constants/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerWrapper: {
    paddingHorizontal: layoutConfig.mainContainer.sidePadding,
    // borderWidth: 1,
    // borderColor: "#ff0000",
  },
  screenTitle: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.lightTitleText,
    marginBottom: 15,
  },
  sportsItem: {
    borderWidth: 1,
    borderColor: colors.brandColorBright,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 20,
    marginBottom: 10,
  },
  sportsItemName: {
    fontSize: 16,
    fontFamily: fontFamily.gothamBold,
    paddingHorizontal: 20,
    color: colors.basicText,
  },
  selectedCategoryContainer: {
    height: 60,
    backgroundColor: colors.brandColorBright,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategoryText: {
    color: colors.basicLightText,
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.extraLarge,
  },
});

export default styles;
