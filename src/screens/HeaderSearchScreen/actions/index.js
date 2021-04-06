import { createActions } from 'redux-actions'

export const {
  setSearchData,
  setSearchSorting,
  setSearchFilter,
  clearSearchData,
  clearSearchFilter,
  clearSearchSorting
} = createActions({
  SET_SEARCH_DATA: payload => payload,
  SET_SEARCH_SORTING: payload => payload,
  SET_SEARCH_FILTER: payload => payload,
  CLEAR_SEARCH_DATA: () => true,
  CLEAR_SEARCH_FILTER: () => true,
  CLEAR_SEARCH_SORTING: () => true
})
