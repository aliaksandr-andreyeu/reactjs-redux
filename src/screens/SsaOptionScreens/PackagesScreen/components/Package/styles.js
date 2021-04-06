import { StyleSheet } from 'react-native'
import colors from '../../../../../constants/colors'
import { fontFamily, fontSize } from '../../../../../constants/fonts'

const styles = StyleSheet.create({
  container: {},
  boxShadow: {
    backgroundColor: colors.backgroundLight,
    marginBottom: 12,
    marginLeft: 7,
    marginRight: 3,
    marginTop: 5,
    minHeight: 140,
    shadowColor: colors.shadowDark,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6
  },
  imageContainer: {
    width: '100%',
    height: 300,
    alignItems: 'flex-end'
  },
  tagContainer: {
    marginTop: 20,
    height: 40,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    backgroundColor: colors.backgroundLight
  },
  tagText: {
    fontSize: fontSize.extraRegular,
    color: colors.basicText,
    fontFamily: fontFamily.gothamBold,
    paddingHorizontal: 15
  },
  eventTitle: {
    fontSize: fontSize.large,
    color: colors.basicText,
    fontFamily: fontFamily.gothamBold,
    lineHeight: 32,
    marginBottom: 10
  },
  eventDetailsContainer: {
    paddingHorizontal: 15,
    paddingTop: 20
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8
  },
  locationName: {
    color: colors.brandColorBright,
    fontSize: fontSize.regular,
    fontFamily: fontFamily.gothamBold,
    marginLeft: 8,
    lineHeight: 20
  },
  dateContainer: {
    left: -15,
    paddingHorizontal: 15,
    height: 30,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: colors.brandColorBright,
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16
  },
  dateText: {
    fontSize: fontSize.regulars,
    color: colors.basicLightText,
    fontFamily: fontFamily.gothamBold,
    marginLeft: 12
  },
  description: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: colors.basicText,
    lineHeight: 24,
    marginBottom: 16
  },
  priceText: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    // TODO: replace colors as design is approved
    fontFamily: fontFamily.gothamBold,
    fontSize: 15,
    color: colors.brandColorBright
  }
})

export default styles
