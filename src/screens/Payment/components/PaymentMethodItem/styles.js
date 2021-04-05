import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';
import { fontFamily, fontSize } from '../../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.brandColorBright,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  label: {
    fontFamily: fontFamily.gothamMedium,
    color: colors.brandColorBright,
    fontSize: fontSize.medium,
  },
});

export default styles;
