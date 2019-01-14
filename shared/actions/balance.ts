import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateBalance = createAction<AddBalanceParams>('balance/UPDATE')
export const resetBalance = createAction('balance/RESET')
export const getBalance = createAsyncAction('balance/GET')
