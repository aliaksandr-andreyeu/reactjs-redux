import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import { fontSize } from '../../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  innerWrapper: {
    alignItems: 'center',
  },
  counterWrapper: {
    flexDirection: 'row',
    width: 208,
    justifyContent: 'center',
  },
  button: {
    height: 50,
    width: 48,
    backgroundColor: colors.brandColorBright,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLeft: {
    borderBottomLeftRadius: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonRigth: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  buttonText: {
    fontSize: 35,
    color: colors.basicLightText,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: fontSize.large,
    color: colors.themeColor,
  },
});

export default styles;
