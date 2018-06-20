import { createAction } from 'redux-actions'

export const setCurrency = createAction('currency/SET_CURRENCY')
export const setRate = createAction<number>('currency/SET_RATE')

export const getCurrencyRateRequested = createAction<GetCurrencyParams>('currency/GET_REQUESTED')
export const getCurrencyRateSucceeded = createAction<GetCurrencyResult>('currency/GET_SUCCEEDED')
export const getCurrencyRateFailed = createAction<ErrorMessage>('currency/GET_FAILED')
