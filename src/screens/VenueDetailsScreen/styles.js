import { StyleSheet } from 'react-native';
import { fontFamily, fontSize } from '../../constants/fonts';
import layout from '../../constants/layout';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: colors.primaryBgColor,
    paddingHorizontal: 16,
  },
  innerWrapper: {
    borderRadius: 10,
    marginBottom: 16,
  },
  sectionContainer: {
    marginHorizontal: layout.mainContainer.sidePadding,
  },
  sectionName: {
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.large,
    color: colors.basicText,
    marginVertical: 15,
  },
});

export default styles;
