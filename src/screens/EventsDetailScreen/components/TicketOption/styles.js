import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../../constants/colors';
import { fontSize, fontFamily } from '../../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brandColorBrightDarker,
  },
  optionsContainer: {
    padding: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: fontSize.medium,
    fontFamily: fontFamily.gothamMedium,
    color: colors.basicLightText,
  },
  optionPrice: {
    fontFamily: fontFamily.gothamBold,
  },
});

export default styles;
