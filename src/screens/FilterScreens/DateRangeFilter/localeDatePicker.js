import i18n from '../../../../i18n'
import { LocaleConfig } from 'react-native-calendars'

const localeDatePicker = () => {
  return {
    monthNames: [
      i18n.t('datePicker.monthNames.jan'),
      i18n.t('datePicker.monthNames.feb'),
      i18n.t('datePicker.monthNames.mar'),
      i18n.t('datePicker.monthNames.apr'),
      i18n.t('datePicker.monthNames.may'),
      i18n.t('datePicker.monthNames.jun'),
      i18n.t('datePicker.monthNames.jul'),
      i18n.t('datePicker.monthNames.aug'),
      i18n.t('datePicker.monthNames.sep'),
      i18n.t('datePicker.monthNames.oct'),
      i18n.t('datePicker.monthNames.nov'),
      i18n.t('datePicker.monthNames.dec')
    ],
    monthNamesShort: [
      i18n.t('datePicker.monthNamesShort.jan'),
      i18n.t('datePicker.monthNamesShort.feb'),
      i18n.t('datePicker.monthNamesShort.mar'),
      i18n.t('datePicker.monthNamesShort.apr'),
      i18n.t('datePicker.monthNamesShort.may'),
      i18n.t('datePicker.monthNamesShort.jun'),
      i18n.t('datePicker.monthNamesShort.jul'),
      i18n.t('datePicker.monthNamesShort.aug'),
      i18n.t('datePicker.monthNamesShort.sep'),
      i18n.t('datePicker.monthNamesShort.oct'),
      i18n.t('datePicker.monthNamesShort.nov'),
      i18n.t('datePicker.monthNamesShort.dec')
    ],
    dayNames: [
      i18n.t('datePicker.dayNames.sun'),
      i18n.t('datePicker.dayNames.mon'),
      i18n.t('datePicker.dayNames.tue'),
      i18n.t('datePicker.dayNames.wed'),
      i18n.t('datePicker.dayNames.thu'),
      i18n.t('datePicker.dayNames.fri'),
      i18n.t('datePicker.dayNames.sat')
    ],
    dayNamesShort: [
      i18n.t('datePicker.dayNamesShort.sun'),
      i18n.t('datePicker.dayNamesShort.mon'),
      i18n.t('datePicker.dayNamesShort.tue'),
      i18n.t('datePicker.dayNamesShort.wed'),
      i18n.t('datePicker.dayNamesShort.thu'),
      i18n.t('datePicker.dayNamesShort.fri'),
      i18n.t('datePicker.dayNamesShort.sat')
    ],
    today: i18n.t('datePicker.today')
  }
}

export default localeDatePicker
