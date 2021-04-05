import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import { fontFamily, fontSize } from '../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.brandColorBright,
  },
  innerWrapper: {
    flexGrow: 1,
    padding: 15,
  },
  item: {
    height: 40,
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: colors.brandColorBright,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  selected: {
    backgroundColor: colors.backgroundLight,
  },
  itemText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.basicLightText,
  },
  itemTextSelected: {
    color: colors.brandColorBright,
  },
  title: {
    color: colors.basicLightText,
  },
});

export default styles;
