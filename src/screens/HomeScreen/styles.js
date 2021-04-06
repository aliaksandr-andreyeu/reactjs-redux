import { StyleSheet } from 'react-native'

import { fontSize, fontFamily } from '../../constants/fonts'

const styles = StyleSheet.create({
  bookAndPlaySection: {
    backgroundColor: '#202873',
    width: '100%',
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
    marginBottom: 7
  },
  bookPlaySectionTitle: {
    justifyContent: 'center',
    color: '#fff',
    paddingTop: 3,
    paddingBottom: 18,
    fontFamily: fontFamily.gothamBold,
    fontSize: fontSize.extraLarge,
    textTransform: 'uppercase'
  },
  bookPlaySectionSubtitle: {
    justifyContent: 'center',
    color: '#fff',
    paddingBottom: 15,
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular + 2,
    lineHeight: 24
  },
  bookPlaySectionButton: {
    backgroundColor: '#3F48A0',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontFamily: fontFamily.gothamMedium,
    paddingTop: 11,
    paddingBottom: 11,
    flex: 1,
    margin: 5,
    fontSize: fontSize.regular + 2
  },
  bookPlaySectionButtonText: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.medium,
    textTransform: 'uppercase'
  },
  bookPlaySectionButtonLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#D3B000'
  },
  bookPlaySectionButtonCenter: {},
  bookPlaySectionButtonRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  whiteText: {
    fontFamily: fontFamily.gothamMedium,
    color: '#fff'
  },
  blueText: {
    fontFamily: fontFamily.gothamMedium,
    color: '#202873'
  },
  bookAndPlaySectionButtons: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 5
  }
})

export default styles
