import { StyleSheet } from 'react-native'
import { fontFamily, fontSize } from '../../constants/fonts'
import colors from '../../constants/colors'
import { Platform } from 'react-native'

const styles = StyleSheet.create({
  categoryButton: {
    padding: 6,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffffff',
    marginRight: 5,
    marginBottom: 5
  },
  categoryButtonActive: {
    padding: 6,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    marginRight: 5,
    marginBottom: 5
  },
  categorySubmitButton: {
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    marginTop: 0,
    marginBottom: 0,
    width: 125,
    justifyContent: 'center'
  },
  categoryText: {
    color: '#ffffff',
    fontFamily: fontFamily.gothamBold,
    fontSize: 14
  },
  categoryTextActive: {
    color: '#06A09A',
    fontFamily: fontFamily.gothamBold,
    fontSize: 14
  },
  container: {
    backgroundColor: '#d3d3d3',
    flex: 1
  },
  developmentModeText: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 20,
    textAlign: 'center'
  },
  dividerContainerEvent: {
    height: 6,
    width: 1
  },
  eventItem: {
    alignSelf: 'stretch',
    backgroundColor: '#c1c1c1',
    height: 40,
    marginTop: 3,
    padding: 10,
    textAlign: 'center'
  },
  filterContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#EAEAEA',
    borderRadius: 5,
    color: '#707070',
    flex: 9,
    flexDirection: 'row',
    fontFamily: fontFamily.gothamMedium,
    fontSize: 15,
    justifyContent: 'center',
    marginBottom: 30,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  filterContainerSearch: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#EAEAEA',
    borderRadius: 5,
    color: '#707070',
    flex: 1,
    flexDirection: 'row',
    fontFamily: fontFamily.gothamMedium,
    fontSize: 15,
    justifyContent: 'center',
    marginBottom: 30,
    marginLeft: 10,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20
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
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bookingsPromoTitle: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: 14,
    lineHeight: 22,
    color: '#FFFFFF'
  },
  bookingsPromoSubtitle: {
    fontFamily: fontFamily.gothamLight,
    fontSize: 12,
    lineHeight: 20,
    color: '#FFFFFF',
    marginTop: 10
  },
  bookingsSearchContainer: {
    padding: 16,
    paddingTop: 31,
    paddingBottom: 34,
    backgroundColor: '#D3B000',
    marginTop: 8,
    borderRadius: 8
  },
  bookingsSearchTitle: {
    fontFamily: fontFamily.gothamMedium,
    textTransform: 'uppercase',
    color: '#202873',
    textAlign: 'center',
    fontSize: 18
  },
  bookingsSearchInput: {
    height: 40,
    fontSize: 15,
    color: '#575756',
    fontFamily: fontFamily.gothamMedium,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    flex: 1,
    shadowColor: '#00000029',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginTop: 8,
    padding: 12,
    paddingLeft: 12,
    paddingRight: 6,
    textAlignVertical: 'center',
    paddingTop: 3,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  bookingSearchInputIcon: {
    flex: 1,
    borderRadius: 3,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 3,
    borderTopRightRadius: 3,
    color: '#202873',
    fontSize: 17,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center'
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5,
    margin: 10
  },
  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center'
  },
  bookingsSearchButton: {
    marginTop: 24,
    alignSelf: 'center'
  },
  bookingsSearchButtonText: {
    color: '#FFFFFF',
    padding: 6,
    paddingTop: 10,
    fontFamily: fontFamily.gothamMedium,
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  bookingFormInput: {
    fontSize: 15,
    color: '#575756',
    fontFamily: fontFamily.gothamMedium,
    backgroundColor: '#FFFFFF',
    flex: 9
  }
})

export default styles
