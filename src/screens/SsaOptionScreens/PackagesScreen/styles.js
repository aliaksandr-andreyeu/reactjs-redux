import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import { fontFamily, fontSize } from '../../../constants/fonts';

const styles = StyleSheet.create({
  selectedDateContainer: {
    height: 60,
    backgroundColor: colors.brandColorBright,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateText: {
    color: colors.basicLightText,
    fontFamily: fontFamily.gothamMedium,
    fontSize: 22,
  },
  titleBox: {
    paddingLeft: 22,
    paddingRight: 18,
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    color: colors.themeColor,
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.large,
    textAlign: 'center',
  },
});

export default styles;
