import { handleActions } from 'redux-actions'
import { GET_CART_SUCCESS } from './actions'

const initialState = []

export default handleActions(
  {
    GET_CART_SUCCESS: (state, { payload }) => payload
  },
  initialState
)
