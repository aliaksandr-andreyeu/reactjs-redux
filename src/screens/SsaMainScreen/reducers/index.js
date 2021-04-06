import { handleActions } from 'redux-actions'

// TODO replace numbers with empty strings for Id items
export const defaultState = {
  title: '',
  desc: '',
  sportCategoryId: '',
  date: '',
  startTime: '',
  endTime: '',
  venueId: '',
  facilityId: '',
  packageId: '',
  packagePrice: 0,
  numberOfParticipants: 0,
  playerLevel: 0,
  payment: 0,
  activityType: 0,
  timeSlotId: -1,
  subFacilityId: -1,
  isActive: true
}

const reducer = handleActions(
  {
    SET_DATA: (state, action) => ({ ...state, ...action.payload }),
    CLEAR_FORM: () => defaultState
  },
  defaultState
)

export default reducer
