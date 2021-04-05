import { createActions } from 'redux-actions';

export const {
  setVenuesData,
  setVenuesSorting,
  setVenuesFilter,
  clearVenuesData,
  clearVenuesFilter,
  clearVenuesSorting,
} = createActions({
  SET_VENUES_DATA: payload => payload,
  SET_VENUES_SORTING: payload => payload,
  SET_VENUES_FILTER: payload => payload,
  CLEAR_VENUES_DATA: () => true,
  CLEAR_VENUES_FILTER: () => true,
  CLEAR_VENUES_SORTING: () => true,
});
