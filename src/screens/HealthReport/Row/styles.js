import { StyleSheet } from 'react-native';
import { fontFamily } from '../../../constants/fonts';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 0.6,
    borderBottomColor: '#c1c1c1',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginLeft: 10,
    fontFamily: fontFamily.gothamMedium,
    color: '#606060',
    fontSize: 16,
  },
  value: {
    color: '#2F8C83',
    fontFamily: fontFamily.gothamBold,
    fontSize: 25,
  },
});
