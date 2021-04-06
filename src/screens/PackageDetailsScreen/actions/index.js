import { createActions } from 'redux-actions'

export const { setData, clearForm } = createActions({
  SET_DATA: payload => payload,
  CLEAR_FORM: () => true
})
