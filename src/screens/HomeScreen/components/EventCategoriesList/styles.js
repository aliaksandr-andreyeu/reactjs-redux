import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontFamily, fontSize } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  itemMainBox: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 64
  },
  itemMain: {
    position: 'absolute',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
    paddingLeft: 18
    // borderWidth: 1,
    // borderColor: "#ff0000",
  },
  buttonWrapper: {
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 5
  },
  buttonText: {
    fontSize: fontSize.regular,
    color: colors.basicLightText,
    backgroundColor: colors.themeColor,
    padding: 4,
    paddingHorizontal: 8
  },
  item: {
    backgroundColor: '#ffffff',
    marginRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 13,
    paddingLeft: 20
  },
  itemText: {
    color: '#8C9091',
    fontSize: 6,
    alignSelf: 'center',
    fontFamily: fontFamily.gothamMedium,
    marginTop: 7
    // marginLeft: 8,
    // borderWidth: 1,
    // borderColor: "#ff0000",
  },
  headingLabel: {
    fontSize: fontSize.regular,
    color: colors.headingBasic,
    fontFamily: fontFamily.gothamMedium,
    paddingHorizontal: 16
  },
  itemImage: {
    width: 164,
    opacity: 0.4,
    height: 64,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10
  }
})

export default styles
