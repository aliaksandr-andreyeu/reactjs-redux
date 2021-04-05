import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';
import { fontFamily, fontSize } from '../../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: colors.placeholderBackground,
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
  },
  boxShadow: {
    backgroundColor: colors.backgroundLight,
    minHeight: 140,
    shadowColor: colors.shadowDark,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
  contentWrapper: {
    padding: 15,
    paddingLeft: 20,
    flex: 2,
  },
  background: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.placeholderBackground,
    flex: 1,
  },
  lineContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  lineText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular + 2,
    color: colors.basicText,
    marginLeft: 15,
  },
  title: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.brandGreen,
    marginBottom: 10,
  },
  locationText: {
    color: colors.brandColorBright,
  },
  priceText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: colors.basicLightText,
  },
});

export default styles;
