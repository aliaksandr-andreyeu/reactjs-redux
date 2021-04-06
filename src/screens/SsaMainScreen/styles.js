import { Platform, StyleSheet } from 'react-native'
import colors from '../../constants/colors'
import { fontFamily, fontSize } from '../../constants/fonts'
import layoutConfig from '../../constants/layout'

const styles = StyleSheet.create({
  titleDesc: {
    marginTop: 16
  },
  inputBox: {
    borderWidth: 1,
    borderColor: 'transparent',
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: layoutConfig.mainContainer.sidePadding,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        backgroundColor: colors.placeholderBackground
      },
      android: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 0.5
      }
    })
  },
  inputValue: {
    padding: 0,
    margin: 0,
    fontSize: fontSize.medium,
    fontFamily: fontFamily.gothamBold,
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    lineHeight: fontSize.medium + 16,
    height: fontSize.medium + 16
  },
  sectionWrapper: {
    flex: 1,
    marginHorizontal: layoutConfig.mainContainer.sidePadding
  },
  header: {
    // TODO: remove hardcoded value (no gradient + mismatch in design)
    backgroundColor: '#2f5e84',
    height: 55,
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  headerText: {
    color: colors.basicLightText,
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.large
  },
  buttonsContainer: {
    backgroundColor: colors.backgroundLight
  },
  buttonText: {
    color: colors.basicLightText
  },

  boxShadow: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 0.5,
    marginBottom: 10
  }
})

export default styles
