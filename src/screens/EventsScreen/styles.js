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

    fontFamily: fontFamily.gothamMedium,
    fontSize: 14,
    color: '#202873',

    textAlign: 'left',

    backgroundColor: '#ffffff',

    borderWidth: 1,
    borderColor: '#8C9091',

    borderRadius: 3
  },
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
  }
})

export default styles
