import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import { fontFamily, fontSize } from '../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    justifyContent: 'space-between',
  },
  contentWrapper: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 24,
  },
  text: {
    fontFamily: fontFamily.gothamMedium,
    color: colors.basicText,
    fontSize: fontSize.medium,
  },
  title: {
    fontFamily: fontFamily.gothamMedium,
    color: colors.themeColor,
    fontSize: fontSize.medium,
    marginBottom: 20,
  },
  searchFieldList: {
    height: 46,

    marginTop: 0,
    marginBottom: 24,
    marginLeft: 1,
    marginRight: 1,

    paddingTop: 9,
    paddingBottom: 7,
    paddingLeft: 16,
    paddingRight: 16,

    fontFamily: fontFamily.gothamMedium,
    fontSize: 18,
    color: '#202873',

    textAlign: 'left',

    backgroundColor: '#ffffff',

    borderWidth: 1,
    borderColor: '#8C9091',

    borderRadius: 3,
  },
});

export default styles;
