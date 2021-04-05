import { StyleSheet } from 'react-native';
import { fontSize, fontFamily } from '../../constants/fonts';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 16,
    paddingTop: 8,
    flex: 1,
    backgroundColor: '#E4E6E6',
  },
  filterContainer: {
    height: 40,
    backgroundColor: colors.secondaryBackgroundLight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.basicText,
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainerText: {
    fontSize: fontSize.large,
    alignSelf: 'center',
    fontFamily: fontFamily.gothamMedium,
    color: colors.basicText,
  },
});

export default styles;
