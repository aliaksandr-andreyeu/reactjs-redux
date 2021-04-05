import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';
import { fontFamily, fontSize } from '../../../../constants/fonts';

const styles = StyleSheet.create({
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  methodText: {
    fontFamily: fontFamily.gothamMedium,
    color: colors.basicText,
    fontSize: fontSize.large,
    marginRight: 15,
  },
  addMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  addMethodPlus: {
    fontFamily: fontFamily.gothamBold,
    color: colors.brandColorBright,
    marginRight: 15,
  },
  addMethodText: {
    fontFamily: fontFamily.gothamMedium,
    color: colors.brandColorBright,
    fontSize: fontSize.large,
  },
  container: {
    marginBottom: 15,
    padding: 15,
  },
  boxShadow: {
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 0.5,
    marginBottom: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});

export default styles;
