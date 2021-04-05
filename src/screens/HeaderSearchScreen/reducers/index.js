import { handleActions } from 'redux-actions';
import { orderOptions } from '../../../components/SortAndFilter/SortOrderItem/constants';

export const defaultSortOptions = {
  name: orderOptions.initial,
  sportsCategory: orderOptions.initial,
};

export const defaultFilters = {
  categoryOfSports: [],
  contentType: '',
};

export const defaultState = {
  sortOptions: defaultSortOptions,
  filters: defaultFilters,
};

const reducer = handleActions(
  {
    SET_SEARCH_DATA: (state, action) => ({ ...state, ...action.payload }),
    SET_SEARCH_FILTER: (state, action) => ({
      ...state,
      filters: {
        ...state.filters,
        ...action.payload,
      },
    }),
    SET_SEARCH_SORTING: (state, action) => ({
      ...state,
      sortOptions: {
        ...state.sortOptions,
        ...action.payload,
      },
    }),
    CLEAR_SEARCH_DATA: () => defaultState,
    CLEAR_SEARCH_SORTING: state => ({
      ...state,
      sortOptions: defaultSortOptions,
    }),
    CLEAR_SEARCH_FILTER: state => ({
      ...state,
      filters: defaultFilters,
    }),
  },
  defaultState
);

export default reducer;
