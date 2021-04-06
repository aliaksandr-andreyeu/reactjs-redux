import { StyleSheet } from 'react-native'
import colors from '../../../../constants/colors'
import { fontFamily, fontSize } from '../../../../constants/fonts'

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  button: {
    height: 35,
    width: 35,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  confirmButton: {
    borderColor: '#089293',
    marginRight: 15
  },
  declineButton: {
    borderColor: '#F92D4F'
  },
  contactImage: {
    width: 39,
    height: 39,
    borderRadius: 19.5
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contactName: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: '#575756',
    lineHeight: 19
  },
  contactLevel: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: '#8C9091',
    lineHeight: 19
  },
  contactDetailsContainer: {
    flexDirection: 'row',
    minHeight: 52
  },
  contactDetails: {
    marginLeft: 20
  }
})

export default styles
