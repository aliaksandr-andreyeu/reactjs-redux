import { StyleSheet } from 'react-native';
import { fontSize, fontFamily } from '../../../../constants/fonts';
import colors from '../../../../constants/colors';

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: fontFamily.gothamBold,
    marginBottom: 6,
    marginTop: 11,
    color: '#78BC4B',
  },
  lineContainer: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  dateContainer: {
    height: 30,
    left: -15,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    alignItems: 'center',
    minWidth: 190,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: colors.brandColorBright,
  },
  locationText: {
    color: colors.brandColorBright,
    fontSize: fontSize.medium,
  },
  dateText: {
    color: colors.basicLightText,
  },
  lineText: {
    fontSize: 12,
    fontFamily: fontFamily.gothamMedium,
    marginLeft: 8,
  },
  invitationLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkTitleContainer: {
    flexDirection: 'row',
  },
});

export default styles;
