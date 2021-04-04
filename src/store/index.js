import { createStore, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'

import reducer from '../reducers'

const initialState = {}

const logger = ({ getState }) => {
  return next => action => {
    console.log('Store Logger. Dispatch action:', action)
    const returnValue = next(action)
    console.log('Store Logger. State after dispatch:', getState())
    return returnValue
  }
}

const middleware = [logger, thunk]

const store = createStore(reducer, initialState, applyMiddleware(...middleware))

export default store
