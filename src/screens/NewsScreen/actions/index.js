import { createActions } from 'redux-actions'

export const {
  setNewsData,
  setNewsSorting,
  setNewsFilter,
  clearNewsData,
  clearNewsFilter,
  clearNewsSorting
} = createActions({
  SET_NEWS_DATA: payload => payload,
  SET_NEWS_SORTING: payload => payload,
  SET_NEWS_FILTER: payload => payload,
  CLEAR_NEWS_DATA: () => true,
  CLEAR_NEWS_FILTER: () => true,
  CLEAR_NEWS_SORTING: () => true
})
