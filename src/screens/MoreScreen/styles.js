import { StyleSheet } from 'react-native';
import colorConstants from '../../constants/colors';
import { fontFamily } from '../../constants/fonts';

const buttonBorderRadius = 80;

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontFamily: fontFamily.gothamBold,
    fontSize: 16,
    color: '#6D6E71',
    marginBottom: 10,
  },
  loginContainer: {
    borderBottomColor: '#c1c1c1',
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  greenButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 40,
    borderWidth: 2,
    borderColor: colorConstants.themeColor,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: buttonBorderRadius,
    flex: 1,
  },
  greenButtonText: {
    fontFamily: fontFamily.gothamBold,
    fontSize: 17,
    color: colorConstants.themeColor,
  },
  greenButtonRegister: {
    marginLeft: 5,
    padding: 8,
    borderWidth: 2,
    borderColor: '#c1c1c1',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: buttonBorderRadius,
    paddingHorizontal: 10,
    flex: 1,
  },
  greenButtonRegisterText: {
    fontFamily: fontFamily.gothamBold,
    fontSize: 17,
    color: '#c1c1c1',
  },
  sectionListContainer: {
    paddingVertical: 10,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  sectionHeader: {
    color: '#525252',
    fontSize: 18,
    fontFamily: fontFamily.gothamBold,
    marginTop: 3,
    marginBottom: 10,
  },
  sectionText: {
    color: '#868686',
    fontFamily: fontFamily.gothamMedium,
    fontSize: 18,
    lineHeight: 28,
    marginTop: 4,
    // marginBottom: 2,
  },
  logoutButtonContainer: {
    borderTopColor: '#c1c1c1',
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    marginLeft: 5,
    color: colorConstants.themeColor,
    fontSize: 18,
    fontFamily: fontFamily.gothamBold,
  },
});
