import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { CalendarList } from 'react-native-calendars'
import moment from 'moment'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import { dayNames } from './constants'
import styles from './styles'
import * as actions from '../../SsaMainScreen/actions'
import colors from '../../../constants/colors'
import { fontFamily, fontSize } from '../../../constants/fonts'
import ConfirmButtons from '../../../components/UI/ConfirmButtons'
import i18n from '../../../../i18n'

class DateScreen extends Component {
  constructor(props) {
    super(props)

    const { navigation } = this.props
    const availableDates = navigation.getParam('dates', [])

    this.calendarRef = React.createRef()

    const markedDates = availableDates
      .filter(date => moment(date).isSameOrAfter(moment(), 'day'))
      .reduce((acc, date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD')
        acc[formattedDate] = { disabled: false, initialDate: date }

        return acc
      }, {})

    this.availableDates = availableDates

    this.state = {
      selectedDate: '',
      markedDates
    }
  }

  // componentDidUpdate() {
  // if (this.calendarRef.current) {
  // this.calendarRef.current.props.onDayPress = () => {
  // console.log('DID Update onDayPress', this.calendarRef.current.props);
  // // this.forceUpdate();
  // }
  // }
  // }

  handleSelect = date => {
    this.setState({
      selectedDate: date.dateString
    })
  }

  render() {
    const { selectedDate, markedDates } = this.state
    const { updateStore } = this.props

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.dayNamesContainer}>
          {dayNames.map((dayName, index) => (
            <Text key={index} style={styles.dayNameText}>
              {dayName}
            </Text>
          ))}
        </View>
        <ScrollView style={styles.containter} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <CalendarList
            {...this.props}
            // key={this.state}
            ref={ref => (this.calendarRef = ref)}
            style={{
              flex: 1
            }}
            theme={{
              selectedDayBackgroundColor: colors.brandColorBright,
              textMonthFontFamily: fontFamily.gothamMedium,
              textDayFontFamily: fontFamily.gothamMedium,
              textMonthFontSize: fontSize.large,
              textDayFontSize: fontSize.large
            }}
            pastScrollRange={0}
            futureScrollRange={3}
            minDate={new Date()}
            firstDay={1}
            disabledByDefault
            markedDates={{
              // ...JSON.parse(JSON.stringify(markedDates)),
              ...markedDates,
              [selectedDate]: { selected: true, disableTouchEvent: true }
            }}
            onDayPress={day => this.handleSelect(day)}
            scrollEnabled
            showScrollIndicator
            hideDayNames
          />
        </ScrollView>
        <View style={{ backgroundColor: colors.themeColor }}>
          <View>
            {!!selectedDate && (
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateText}>{moment(selectedDate).format('MMMM, ddd DD')}</Text>
              </View>
            )}
          </View>
          <ConfirmButtons
            confirmLabel={i18n.t('generic.buttons.apply')}
            cancelLabel={i18n.t('generic.buttons.clear')}
            buttonStyle={{ borderWidth: 1, borderColor: colors.borderLight }}
            handleSave={() =>
              updateStore({
                date: this.availableDates.find(v => v.slice(0, 10) === selectedDate),
                startTime: '',
                endTime: ''
              })
            }
          />
        </View>
      </View>
    )
  }
}

const mapDispatchToProps = {
  updateStore: actions.setData
}

DateScreen.propTypes = {
  updateStore: propTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(DateScreen)
