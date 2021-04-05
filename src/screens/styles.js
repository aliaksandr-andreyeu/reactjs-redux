import { Dimensions, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { fontFamily, fontSize } from '../constants/fonts';

export default function getStyles() {
  return StyleSheet.create({
    rectangle: { width: 100, height: 100, backgroundColor: 'red' },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderRightWidth: 100,
      borderTopWidth: 100,
      borderRightColor: 'transparent',
      borderTopColor: 'red',
    },
    triangleCornerBottomLeft: {
      transform: [{ rotate: '270deg' }],
    },
    text: {
      color: '#202873',
      fontSize: 14,
      fontFamily: fontFamily.gothamMedium,
    },
    linksText: {
      color: '#202873',
      fontSize: 12,
      fontFamily: fontFamily.gothamBold,
    },
    authText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: fontFamily.gothamLight,
      textAlign: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: fontFamily.gothamMedium,
      textAlign: 'center',
    },
    authButton: {
      width: '100%',
      padding: 15,
      borderRadius: 4,
      marginTop: 16,
    },
    buttonTeal: {
      backgroundColor: '#00B5DF',
    },
    buttonRed: {
      backgroundColor: '#EE3124',
    },
    buttonGreen: {
      backgroundColor: '#78BC4B',
    },
    choiceContainer: {
      position: 'absolute',
      bottom: Dimensions.get('window').height > 667 ? 54 : 10,
      flex: 1,
      width: '100%',
      paddingLeft: 16,
      paddingRight: 16,
      textAlign: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      //    backgroundColor: '#fff',
      alignItems: 'center',
    },
    contentContainer: {
      paddingTop: 30,
    },
    authButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: fontFamily.gothamLight,
      padding: 8,
    },
  });
}
