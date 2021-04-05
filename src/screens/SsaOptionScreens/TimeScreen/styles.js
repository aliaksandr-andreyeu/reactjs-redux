import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import { fontFamily, fontSize } from '../../../constants/fonts';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.brandColorBright, justifyContent: 'flex-start' },
  hourContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.basicLightText,
    backgroundColor: colors.brandColorBright,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  hourContainerActive: {
    borderColor: colors.basicLightText,
    backgroundColor: colors.backgroundLight,
  },
  hourContianerDisabled: {
    borderColor: colors.disabledBorder,
    backgroundColor: colors.brandColorBright,
  },
  halfDaySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.basicLightText,
    paddingBottom: 10,
    marginBottom: 10,
  },
  itemText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: colors.basicLightText,
    textAlign: 'center',
  },
  activeItemText: {
    color: colors.brandColorBright,
  },
  disabledItemText: {
    color: colors.disabledText,
  },
});

export default styles;
