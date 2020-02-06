import { createStore } from 'redux'
import { reducer, initialState } from '../reducers'

const store = createStore(reducer, initialState)

export default store
