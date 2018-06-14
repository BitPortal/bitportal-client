import { createAction } from 'redux-actions'

export const setCurrency = createAction('currency/SET_CURRENCY')
export const setRate = createAction('currency/SET_RATE')

export const getCurrencyRateRequested = createAction('currency/GET_REQUESTED')
export const getCurrencyRateSucceeded = createAction<object>('currency/GET_SUCCEEDED')
export const getCurrencyRateFailed = createAction<ErrorMessage>('currency/GET_FAILED')
