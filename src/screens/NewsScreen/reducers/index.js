import { handleActions } from 'redux-actions';
import { orderOptions } from '../../../components/SortAndFilter/SortOrderItem/constants';

export const defaultSortOptions = {
  name: orderOptions.initial,
  date: orderOptions.initial,
  venue: orderOptions.initial,
  sportsCategory: orderOptions.initial,
  price: orderOptions.initial,
};

export const defaultFilters = {
  categoryOfSports: [],
  dateRange: [],
};

export const defaultState = {
  sortOptions: defaultSortOptions,
  filters: defaultFilters,
};

const reducer = handleActions(
  {
    SET_NEWS_DATA: (state, action) => ({ ...state, ...action.payload }),
    SET_NEWS_FILTER: (state, action) => ({
      ...state,
      filters: {
        ...state.filters,
        ...action.payload,
      },
    }),
    SET_NEWS_SORTING: (state, action) => ({
      ...state,
      sortOptions: {
        ...state.sortOptions,
        ...action.payload,
      },
    }),
    CLEAR_NEWS_DATA: () => defaultState,
    CLEAR_NEWS_SORTING: state => ({
      ...state,
      sortOptions: defaultSortOptions,
    }),
    CLEAR_NEWS_FILTER: state => ({
      ...state,
      filters: defaultFilters,
    }),
  },
  defaultState
);

export default reducer;
