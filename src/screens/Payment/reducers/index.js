import { handleActions } from 'redux-actions'

export const defaultState = {
  successCallbacks: []
}

const reducer = handleActions(
  {
    ADD_SUCCESS_CALLBACK: (state, action) => ({
      ...state,
      successCallbacks: [...state.successCallbacks, action.payload]
    }),
    CLEAR_SUCCESS_CALLBACKS: state => ({
      ...state,
      successCallbacks: []
    })
  },
  defaultState
)

export default reducer
