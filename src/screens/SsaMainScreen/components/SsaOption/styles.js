import { Platform, StyleSheet } from 'react-native';
import layoutConfig from '../../../../constants/layout';
import colors from '../../../../constants/colors';
import { fontFamily, fontSize } from '../../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    height: 50,
    paddingHorizontal: layoutConfig.mainContainer.sidePadding,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        backgroundColor: colors.placeholderBackground,
      },
      android: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 0.5,
      },
    }),
  },
  titleSection: {
    flexDirection: 'row',
  },
  title: {
    marginLeft: 10,
    fontSize: fontSize.medium,
    fontFamily: fontFamily.gothamBold,
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
  },
  value: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.large,
    color: colors.themeColor,
  },
  valueContainer: {
    maxWidth: '50%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  error: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: colors.errorText,
    marginBottom: 10,
  },
  disabled: {
    backgroundColor: colors.placeholderBackground,
  },
});

export default styles;
