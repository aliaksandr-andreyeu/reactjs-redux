import { StyleSheet } from 'react-native';
import { fontFamily, fontSize } from '../../../../constants/fonts';
import colors from '../../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 15,
    backgroundColor: colors.brandColorBright,
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderRadius: 5,
  },
  arrowsContainer: {
    flexDirection: 'row',
    width: 50,
  },
  selected: {
    backgroundColor: colors.backgroundLight,
  },
  title: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.basicLightText,
  },
  selectedTitle: {
    color: colors.brandColorBright,
  },
});

export default styles;
