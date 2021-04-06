import React, { Component } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import styles from './styles'
import { axiosInstance, apiUrls } from '../../../../constants/api'
import isEqual from 'lodash.isequal'

class Seat extends Component {
  constructor(props) {
    super(props)

    const { seat } = props

    this.state = {
      isSelected: seat.isReserved
    }
  }

  handlePress = seat => {
    const { isSelected } = this.state
    const { checkSeat } = this.props

    const TicketCode = seat.TicketCode

    // console.log('seat', seat);
    // console.log('TicketCode', TicketCode);

    if (isSelected) {
      const params = {
        TicketId: TicketCode
      }

      axiosInstance.post(apiUrls.postDeleteSeat, params).then(res => {
        // console.log(res);

        if (!res.isError) {
          this.setState(
            {
              isSelected: false
            },
            () => {
              checkSeat()
            }
          )
        }
      })
    } else {
      const params = {
        TicketId: TicketCode,
        Count: 1
      }

      axiosInstance.post(apiUrls.postReserveSeat, params).then(res => {
        // console.log(res);

        if (!res.isError) {
          this.setState(
            {
              isSelected: true
            },
            () => {
              checkSeat()
            }
          )
        }
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { isExist } = this.props
    if (!isEqual(isExist, prevProps.isExist)) {
      this.setState({
        isSelected: isExist
      })
    }
  }

  render() {
    const { seat } = this.props
    const { isSelected } = this.state

    return (
      <TouchableOpacity
        onPress={() => {
          this.handlePress(seat)
        }}
        style={[styles.container, isSelected && styles.selectedContainer]}
      >
        <Text style={[styles.text, isSelected && styles.selectedText]}>{seat.Seat}</Text>
      </TouchableOpacity>
    )
  }
}

export default Seat
