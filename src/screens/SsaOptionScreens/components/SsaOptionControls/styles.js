import { StyleSheet } from 'react-native';
import { fontSize, fontFamily } from '../../../../constants/fonts';
import colors from '../../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.brandColorBright,
    height: 90,
  },
  button: {
    width: 177,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.large + 2,
    color: colors.brandColorBright,
  },
});

export default styles;
