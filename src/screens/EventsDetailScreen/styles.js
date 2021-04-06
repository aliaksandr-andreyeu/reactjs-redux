import { StyleSheet } from 'react-native'
import { fontFamily, fontSize } from '../../constants/fonts'
import colors from '../../constants/colors'

const styles = StyleSheet.create({
  searchFieldList: {
    height: 40,

    marginTop: 6,
    marginBottom: 16,
    marginLeft: 1,
    marginRight: 1,

    paddingTop: 9,
    paddingBottom: 7,
    paddingLeft: 16,
    paddingRight: 16,

    fontFamily: fontFamily.gothamRegular,
    fontSize: 14,
    color: '#202873',

    textAlign: 'left',

    backgroundColor: '#f9f9f9',

    borderWidth: 1,
    borderColor: '#8C9091',

    borderRadius: 3
  },
  bodyViewStyle: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  boxShadow: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    marginLeft: 7,
    marginRight: 3,
    marginTop: 5,
    minHeight: 140,
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6
  },
  boxShadowNoLeftMargin: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    marginLeft: 0,
    marginRight: 3,
    marginTop: 5,
    minHeight: 140,
    paddingLeft: 0,
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 6
  },
  commonTextStyle: {
    color: 'white',
    fontSize: 18
  },
  container: {
    backgroundColor: colors.backgroundLight,
    flex: 1
  },
  dateStyle: {
    backgroundColor: '#2F8C83',
    flexDirection: 'row',
    // marginLeft: -15,
    // marginTop: 10,
    padding: 5,
    paddingLeft: 13,
    paddingRight: 15,
    minWidth: 150,
    flexWrap: 'nowrap'
  },
  developmentModeText: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 20,
    textAlign: 'center'
  },
  dividerContainer: {
    height: 1,
    width: 25
  },
  dividerContainerEvent: {
    height: 19,
    width: 1
  },
  dividerContainerRecommended: {
    height: 1,
    width: 0
  },
  eventItem: {
    alignSelf: 'stretch',
    backgroundColor: '#c1c1c1',
    height: 40,
    marginTop: 3,
    padding: 10,
    textAlign: 'center'
  },
  headerLayoutStyle: {
    alignItems: 'center',
    backgroundColor: 'orange',
    height: 100,
    justifyContent: 'center'
  },
  horizontalLine: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 24,
    marginTop: 24,
    opacity: 0.1
  },
  horizontalLineDate: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    opacity: 0.1
  },
  input: {
    alignSelf: 'stretch',
    borderColor: '#7a42f4',
    borderWidth: 1,
    height: 40,
    margin: 15,
    textAlign: 'center'
  },
  searchInput: {
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: '#EAEAEA',
    borderRadius: 5,
    color: '#707070',
    fontFamily: fontFamily.gothamMedium,
    fontSize: 15,
    marginBottom: 30,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'left'
  },
  slidingPanelLayoutStyle: {
    alignItems: 'center',
    backgroundColor: '#7E52A0',
    flex: 1,
    justifyContent: 'center',
    minHeight: 500
  },
  ticketPriceContainer: {
    backgroundColor: colors.secondaryBackgroundLight,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginBottom: 15
  },
  ticketPriceText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    color: colors.basicText,
    marginLeft: 15
  },
  ticketPurchaseContainer: {
    height: 50,
    backgroundColor: colors.brandColorBright,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 5
  },
  ticketPurchaseText: {
    color: colors.basicLightText,
    fontSize: fontSize.large + 2,
    fontFamily: fontFamily.gothamMedium
  },
  text: {
    color: colors.basicText,
    fontSize: fontSize.medium,
    fontFamily: fontFamily.gothamMedium
  },
  boldText: {
    fontFamily: fontFamily.boldText
  },
  paddedWrapper: {
    paddingHorizontal: 15
  }
})

export default styles
