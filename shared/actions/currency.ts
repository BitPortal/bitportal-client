import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const setCurrency = createAction('currency/SET_CURRENCY')
export const updateCurrencyRates = createAction('currency/UPDATE_CURRENCY_RATE')
export const getCurrencyRates = createAsyncAction('currency/GET_CURRENCY_RATE')
