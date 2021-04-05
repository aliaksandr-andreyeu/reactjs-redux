import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { fontFamily } from '../../constants/fonts';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.primaryBgColor,
  },
  container: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  containerBox: {
    alignItems: 'center',
  },
  containerWrapper: {},
  version: {
    marginTop: -15,
    marginBottom: 35,
    fontSize: 13,
    color: colors.lightTitleText,
    fontFamily: fontFamily.gothamMedium,
  },
  description: {
    color: colors.basicText,
    lineHeight: 20,
    fontSize: 14,
    fontFamily: fontFamily.gothamMedium,
  },
});
