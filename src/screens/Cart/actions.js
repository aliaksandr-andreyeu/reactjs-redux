import { createAction } from 'redux-actions'

export const GET_CART = 'GET_CART'
export const getCart = createAction(GET_CART)

export const GET_CART_SUCCESS = 'GET_CART_SUCCESS'
export const getCartSuccess = createAction(GET_CART_SUCCESS)

export const GET_CART_ERROR = 'GET_CART_ERROR'
export const getCartError = createAction(GET_CART_ERROR)
