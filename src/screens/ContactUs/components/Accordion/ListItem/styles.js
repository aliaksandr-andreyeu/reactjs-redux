import { StyleSheet } from 'react-native'

import { fontFamily, fontSize } from '../../../../../constants/fonts'
import colors from '../../../../../constants/colors'

const styles = StyleSheet.create({
  itemBox: {
    flexDirection: 'row',
    minHeight: 40,

    paddingTop: 8,
    paddingBottom: 8,

    paddingLeft: 12,
    paddingRight: 12,

    flexBasis: 'auto',
    justifyContent: 'space-between',

    alignItems: 'center'
  },
  textAnswerBox: {
    minHeight: 40,

    paddingTop: 4,
    paddingBottom: 12,

    paddingLeft: 12,
    paddingRight: 12
  },
  textAnswer: {
    fontFamily: fontFamily.gothamRegular,
    fontSize: fontSize.regular,
    color: '#4F4F4F'
  },
  textQuestion: {
    fontFamily: fontFamily.gothamMedium,
    fontSize: fontSize.regular,
    color: '#202873',
    flexShrink: 1
  }
})

export default styles
