import { INCREMENT, DECREMENT } from '../constants'

export const initialState = {
	value: 0,
}

export const reducer = (state = initialState, action) => {
	let value = state.value ? state.value : 0
	switch (action.type) {
		case INCREMENT:
			value = value + 1
			return {
				...state,
				value,
			}
		case DECREMENT:
			value = value - 1
			return {
				...state,
				value,
			}
		default:
			return state
	}
}
