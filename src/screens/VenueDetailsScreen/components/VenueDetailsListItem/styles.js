import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontFamily, fontSize } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 136,
    marginHorizontal: 5
  },
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.placeholderBackground,
    justifyContent: 'space-between'
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  containerWithDate: {
    justifyContent: 'space-between'
  },
  dateContainer: {
    width: 83,
    height: 54
  },
  dateGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingVertical: 10,
    justifyContent: 'center'
  },
  date: {
    marginLeft: 15,
    fontSize: 10,
    color: '#4F4F4F',
    lineHeight: 12,
    fontFamily: fontFamily.gothamBold
  },
  tagContainer: {
    top: 5,
    height: 30,
    width: 85,
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15
  },
  tag: {
    top: 10,
    height: 40,
    width: 60,
    color: colors.brandColorBright,
    fontSize: fontSize.regular,
    fontFamily: fontFamily.gothamBold,
    textAlign: 'right'
  },
  descriptionContainer: {
    justifyContent: 'flex-end',
    marginBottom: 12,
    marginLeft: 15
  },
  description: {
    color: colors.basicLightText,
    justifyContent: 'flex-end',
    fontSize: fontSize.regular + 2,
    fontFamily: fontFamily.gothamBold
  }
})

export default styles
