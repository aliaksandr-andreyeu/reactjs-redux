import { StyleSheet } from 'react-native';
import { fontSize, fontFamily } from '../../../../constants/fonts';
import colors from '../../../../constants/colors';

const styles = StyleSheet.create({
  text: {
    fontSize: fontSize.medium,
    color: colors.basicText,
    fontFamily: fontFamily.gothamMedium,
  },
  priceText: {
    fontFamily: fontFamily.gothamMedium,
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    justifyContent: 'center',
  },
  priceContainer: {
    position: 'absolute',
    bottom: 0,
    height: 32,
    width: '100%',
    backgroundColor: '#78BC4B',
    textAlign: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.large,
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  lineValue: {
    fontFamily: fontFamily.gothamBold,
  },
  button: {
    marginVertical: 8,
    flex: 1,
    marginRight: 8,
  },
  buttonText: {
    color: colors.brandColorBright,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 2,
    paddingTop: 2,
  },
  cancelButton: {
    backgroundColor: colors.brandColorBright,
    marginRight: 0,
  },
  cancelButtonText: {
    color: colors.basicLightText,
  },
});

export default styles;
