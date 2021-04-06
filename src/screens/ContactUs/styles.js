import { StyleSheet } from 'react-native'
import { fontFamily, fontSize } from '../../constants/fonts'
import colors from '../../constants/colors'

const styles = StyleSheet.create({
  box: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: colors.primaryBgColor
  },
  title: {
    fontSize: fontSize.submedium,
    color: colors.headingBasic,
    fontFamily: fontFamily.gothamMedium,
    textTransform: 'uppercase',
    marginBottom: 8
  },
  subTitle: {
    fontSize: fontSize.regular,
    color: '#4F4F4F',
    fontFamily: fontFamily.gothamRegular
  },
  input: {
    height: 40,

    marginTop: 8,
    marginBottom: 20,

    paddingTop: 9,
    paddingBottom: 7,
    paddingLeft: 16,
    paddingRight: 16,

    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: '#202873',

    textAlign: 'left',

    backgroundColor: '#ffffff',

    borderWidth: 1,
    borderColor: '#8C9091',

    borderRadius: 3
  },
  textareaBox: {
    minHeight: 40,

    marginTop: 8,
    marginBottom: 20,

    paddingTop: 9,
    paddingBottom: 7,
    paddingLeft: 16,
    paddingRight: 16,

    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: '#202873',

    textAlign: 'left',

    backgroundColor: '#ffffff',

    borderWidth: 1,
    borderColor: '#8C9091',

    borderRadius: 3,

    textAlignVertical: 'top'
  },
  dropdownBox: {
    marginTop: 10,
    marginBottom: 16
  },
  dropdown: {
    height: 40,

    borderWidth: 1,
    borderColor: '#8C9091',

    borderRadius: 3,

    paddingTop: 11,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,

    backgroundColor: '#ffffff'
  },
  dropdownText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: '#202873'
  },
  btnBox: {
    backgroundColor: '#000066',
    borderRadius: 4,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  btn: {},
  btnText: {
    fontFamily: fontFamily.gothamMedium,
    color: '#ffffff',
    fontSize: fontSize.submedium
  }
})

export default styles
