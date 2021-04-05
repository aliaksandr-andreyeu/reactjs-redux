import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { fontFamily, fontSize } from '../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.medium,
    color: colors.basicText,
    marginTop: 10,
    marginBottom: 20,
  },
  innerContainer: {
    paddingHorizontal: 15,
    flexGrow: 1,
  },
});

export default styles;
