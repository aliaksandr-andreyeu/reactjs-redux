import { handleActions } from 'redux-actions'
import { orderOptions } from '../../../components/SortAndFilter/SortOrderItem/constants'

export const defaultSortOptions = {
  name: orderOptions.initial,
  // date: orderOptions.initial,
  date: 1,
  venue: orderOptions.initial,
  sportsCategory: orderOptions.initial,
  price: orderOptions.initial
}

export const defaultFilters = {
  categoryOfSports: [],
  eventType: [],
  dateRange: [],
  venue: [],
  distance: ''
}

export const defaultState = {
  sortOptions: defaultSortOptions,
  filters: defaultFilters
}

const reducer = handleActions(
  {
    SET_BOOKINGS_DATA: (state, action) => ({ ...state, ...action.payload }),
    SET_BOOKINGS_FILTER: (state, action) => ({
      ...state,
      filters: {
        ...state.filters,
        ...action.payload
      }
    }),
    SET_BOOKINGS_SORTING: (state, action) => ({
      ...state,
      sortOptions: {
        ...state.sortOptions,
        ...action.payload
      }
    }),
    CLEAR_BOOKINGS_DATA: () => defaultState,
    CLEAR_BOOKINGS_SORTING: state => ({
      ...state,
      sortOptions: defaultSortOptions
    }),
    CLEAR_BOOKINGS_FILTER: state => ({
      ...state,
      filters: defaultFilters
    })
  },
  defaultState
)

export default reducer
