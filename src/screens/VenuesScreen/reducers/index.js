import { handleActions } from 'redux-actions';
import { orderOptions } from '../../../components/SortAndFilter/SortOrderItem/constants';

export const defaultSortOptions = {
  sportsCategory: orderOptions.initial,
  // name: orderOptions.initial,
  name: 1,
};

export const defaultFilters = {
  categoryOfSports: [],
  distance: '',
};

export const defaultState = {
  sortOptions: defaultSortOptions,
  filters: defaultFilters,
};

const reducer = handleActions(
  {
    SET_VENUES_DATA: (state, action) => ({ ...state, ...action.payload }),
    SET_VENUES_FILTER: (state, action) => ({
      ...state,
      filters: {
        ...state.filters,
        ...action.payload,
      },
    }),
    SET_VENUES_SORTING: (state, action) => ({
      ...state,
      sortOptions: {
        ...state.sortOptions,
        ...action.payload,
      },
    }),
    CLEAR_VENUES_DATA: () => defaultState,
    CLEAR_VENUES_SORTING: state => ({
      ...state,
      sortOptions: defaultSortOptions,
    }),
    CLEAR_VENUES_FILTER: state => ({
      ...state,
      filters: defaultFilters,
    }),
  },
  defaultState
);

export default reducer;
