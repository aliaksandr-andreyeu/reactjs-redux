import { StyleSheet } from 'react-native'
import { fontFamily, fontSize } from '../../../../constants/fonts'
import colors from '../../../../constants/colors'

const imageSide = 40

const styles = StyleSheet.create({
  contactContainer: {
    flexDirection: 'row',
    marginBottom: 15
  },
  imageContainer: {
    height: imageSide,
    width: imageSide,
    borderRadius: imageSide / 2,
    backgroundColor: colors.placeholderBackground,
    marginRight: 18
  },
  imageWrapper: {
    borderRadius: imageSide / 2,
    height: imageSide,
    width: imageSide,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selected: {
    borderRadius: imageSide / 2,
    height: imageSide,
    width: imageSide,
    backgroundColor: 'rgba(8, 146, 147, 0.6)'
  },
  text: {
    fontFamily: fontFamily.gothamMedium,
    color: colors.basicText
  },
  contactTextConatiner: {
    marginLeft: 17,
    justifyContent: 'space-between'
  },
  contactName: {
    fontSize: fontSize.regular + 2,
    color: colors.basicText
  },
  contactLevel: {
    fontSize: fontSize.regular,
    color: colors.lightTitleText
  },
  checkIcon: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default styles
