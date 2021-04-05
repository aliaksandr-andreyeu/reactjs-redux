import { StyleSheet } from 'react-native';
import colors from '../../../../constants/colors';
import { fontSize, fontFamily } from '../../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brandColorBright,
  },
  sectionContainer: {
    paddingHorizontal: 15,
  },
  sectionHeader: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.large,
    color: colors.basicLightText,
    marginBottom: 15,
  },
  filterContainer: {
    borderBottomColor: colors.borderLight,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  itemName: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.basicLightText,
  },
  checkBox: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    height: 25,
    width: 25,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.brandColorBright,
  },
});

export default styles;
