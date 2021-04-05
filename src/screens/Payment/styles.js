import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { fontFamily, fontSize } from '../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  addButton: {
    fontFamily: fontFamily.gothamMedium,
    color: colors.brandColorBright,
    fontSize: fontSize.medium,
  },
  contentWrapper: {},
  text: {
    fontFamily: fontFamily.gothamMedium,
    color: colors.basicText,
    fontSize: fontSize.medium,
  },
  mainContent: {
    fontSize: fontSize.large,
  },
  lightText: {
    color: colors.placeholderText,
  },
  title: {
    marginBottom: 15,
    fontFamily: fontFamily.gothamBold,
  },
  footerSection: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  accountBalanceInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  accountBalanceInfoText: {
    marginLeft: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 40,
    width: 150,
    backgroundColor: colors.brandColorBright,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.basicLightText,
  },
  disabledButton: {
    backgroundColor: colors.disabledButton,
  },
  disabledButtonText: {
    color: colors.disabledText,
  },
});

export default styles;
