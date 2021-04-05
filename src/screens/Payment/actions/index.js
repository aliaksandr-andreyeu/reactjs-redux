import { createActions } from 'redux-actions';

export const { addSuccessCallback, clearCallbacks } = createActions({
  ADD_SUCCESS_CALLBACK: payload => payload,
  CLEAR_SUCCESS_CALLBACKS: () => true,
});
