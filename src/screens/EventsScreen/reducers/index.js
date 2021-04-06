import { handleActions } from 'redux-actions'
import { orderOptions } from '../../../components/SortAndFilter/SortOrderItem/constants'

import moment from 'moment'

export const defaultSortOptions = {
  name: orderOptions.initial,
  date: orderOptions.initial,
  venue: orderOptions.initial,
  sportsCategory: orderOptions.initial,
  price: orderOptions.initial
}

export const defaultFilters = {
  categoryOfSports: [],
  eventType: [],
  // dateRange: [moment().format('YYYY-MM-DD'), moment().add(2, 'years').format('YYYY-MM-DD')],
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
    SET_EVENTS_DATA: (state, action) => ({ ...state, ...action.payload }),
    SET_EVENTS_FILTER: (state, action) => ({
      ...state,
      filters: {
        ...state.filters,
        ...action.payload
      }
    }),
    SET_EVENTS_SORTING: (state, action) => ({
      ...state,
      sortOptions: {
        ...state.sortOptions,
        ...action.payload
      }
    }),
    CLEAR_EVENTS_DATA: () => defaultState,
    CLEAR_EVENTS_SORTING: state => ({
      ...state,
      sortOptions: defaultSortOptions
    }),
    CLEAR_EVENTS_FILTER: state => ({
      ...state,
      filters: {
        ...defaultFilters,
        ...{
          dateRange: []
        }
      }
    })
  },
  defaultState
)

export default reducer
