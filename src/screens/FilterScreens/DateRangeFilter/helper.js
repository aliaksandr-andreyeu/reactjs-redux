// Date range selection

import React, { Component } from 'react'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'

export default class DateRangePicker extends Component {
  constructor(props) {
    super(props)

    this.calendarRef = React.createRef()

    this.state = {
      isFromDatePicked: false,
      isToDatePicked: false,
      markedDates: {}
    }
  }

  componentDidMount() {
    this.setupInitialRange()
  }

  // componentDidUpdate() {
  // if (this.calendarRef.current) {
  // this.calendarRef.current.props.onDayPress = () => {
  // console.log('DID Update onDayPress', this.calendarRef.current.props);
  // // this.forceUpdate();
  // }
  // }
  // }

  onDayPress = day => {
    const { isFromDatePicked, isToDatePicked, markedDates, fromDate } = this.state
    if (!isFromDatePicked || (isFromDatePicked && isToDatePicked)) {
      this.setupStartMarker(day)
    } else if (!isToDatePicked) {
      // const markedDatesCopy = JSON.parse(JSON.stringify(markedDates));
      const markedDatesCopy = { ...markedDates }

      const [mMarkedDates, range] = this.setupMarkedDates(fromDate, day.dateString, markedDatesCopy)
      if (range >= 0) {
        this.setState({ isFromDatePicked: true, isToDatePicked: true, markedDates: mMarkedDates })
        // this.props.onSuccess(this.state.fromDate, day.dateString);
      } else {
        this.setupStartMarker(day)
      }
    }
  }

  setupStartMarker = day => {
    const markedDates = {
      [day.dateString]: {
        startingDay: true,
        color: 'red',
        textColor: 'white'
      }
    }
    this.setState({
      isFromDatePicked: true,
      isToDatePicked: false,
      fromDate: day.dateString,
      markedDates
    })
  }

  setupMarkedDates = (fromDate, toDate, markedDates) => {
    // let markedDatesCopy = JSON.parse(JSON.stringify(markedDates));
    let markedDatesCopy = { ...markedDates }

    const mFromDate = moment(fromDate)
    const mToDate = moment(toDate)
    const range = mFromDate.diffDays(mToDate)
    if (range >= 0) {
      if (range === 0) {
        markedDatesCopy = {
          [toDate]: {
            color: 'red',
            textColor: 'white'
          }
        }
      } else {
        for (let i = 1; i <= range; i++) {
          const tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd')
          if (i < range) {
            markedDatesCopy[tempDate] = {
              color: 'red',
              textColor: 'white'
            }
          } else {
            markedDatesCopy[tempDate] = {
              endingDay: true,
              color: 'red',
              textColor: 'white'
            }
          }
        }
      }
    }
    return [markedDates, range]
  }

  setupInitialRange = () => {
    if (!this.props.initialRange) {
      return
    }
    const [fromDate, toDate] = this.props.initialRange
    const markedDates = {
      [fromDate]: {
        startingDay: true,
        color: this.props.theme.markColor,
        textColor: this.props.theme.markTextColor
      }
    }
    const [mMarkedDates, range] = this.setupMarkedDates(fromDate, toDate, markedDates)
    this.setState({ markedDates: mMarkedDates, fromDate })
  }

  render() {
    return (
      <Calendar
        {...this.props}
        ref={ref => (this.calendarRef = ref)}
        // key={this.state}
        markingType="period"
        current={this.state.fromDate}
        markedDates={this.state.markedDates}
        onDayPress={day => {
          this.onDayPress(day)
        }}
      />
    )
  }
}

DateRangePicker.defaultProps = {
  theme: { markColor: '#00adf5', markTextColor: '#ffffff' }
}
