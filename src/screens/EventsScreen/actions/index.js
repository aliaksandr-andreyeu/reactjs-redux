import { createActions } from 'redux-actions';

export const {
  setEventsData,
  setEventsSorting,
  setEventsFilter,
  clearEventsData,
  clearEventsFilter,
  clearEventsSorting,
} = createActions({
  SET_EVENTS_DATA: payload => payload,
  SET_EVENTS_SORTING: payload => payload,
  SET_EVENTS_FILTER: payload => payload,
  CLEAR_EVENTS_DATA: () => true,
  CLEAR_EVENTS_FILTER: () => true,
  CLEAR_EVENTS_SORTING: () => true,
});
