import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';
import { fontSize, fontFamily } from '../../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomColor: colors.basicBorder,
    borderBottomWidth: 1,
    flex: 1,
  },
  image: {
    flexGrow: 1,
    width: 50,
    height: 50,
    backgroundColor: colors.placeholderBackground,
    borderRadius: 25,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  text: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: colors.basicText,
  },
  name: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.medium,
    marginBottom: 15,
    flex: 1,
  },
  accountBalance: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.Large,
  },
});

export default styles;
