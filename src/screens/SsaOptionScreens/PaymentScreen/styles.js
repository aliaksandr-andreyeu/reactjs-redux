import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import { fontFamily, fontSize } from '../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inputOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.basicBorder,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: 164,
    borderRadius: 5,
  },
  input: {
    width: 100,
    paddingLeft: 10,
    fontSize: fontSize.large,
    fontFamily: fontFamily.gothamMedium,
  },
  currencyLabel: {
    paddingHorizontal: 15,
    fontSize: fontSize.large,
    fontFamily: fontFamily.gothamMedium,
  },
});

export default styles;
