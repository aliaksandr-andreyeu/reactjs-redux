import { createActions } from 'redux-actions'

export const {
  setBookingsData,
  setBookingsSorting,
  setBookingsFilter,
  clearBookingsData,
  clearBookingsFilter,
  clearBookingsSorting
} = createActions({
  SET_BOOKINGS_DATA: payload => payload,
  SET_BOOKINGS_SORTING: payload => payload,
  SET_BOOKINGS_FILTER: payload => payload,
  CLEAR_BOOKINGS_DATA: () => true,
  CLEAR_BOOKINGS_FILTER: () => true,
  CLEAR_BOOKINGS_SORTING: () => true
})
