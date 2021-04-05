import { handleActions } from 'redux-actions';

// TODO replace numbers with empty strings for Id items
export const defaultState = {
  date: null,
  subFacilityId: -1,
  startTime: null,
  endTime: null,
  timeSlotId: -1,
};

const reducer = handleActions(
  {
    SET_DATA: (state, action) => ({ ...state, ...action.payload }),
    CLEAR_FORM: () => defaultState,
  },
  defaultState
);

export default reducer;
