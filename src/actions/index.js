import { INCREMENT, DECREMENT, REQUEST_DATA } from '../constants'

export const increment = () => {
  return {
    type: INCREMENT
  }
}

export const decrement = () => {
  return {
    type: DECREMENT
  }
}

export const requestData = payload => {
  return {
    type: REQUEST_DATA,
    payload
  }
}
