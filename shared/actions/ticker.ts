import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateTicker = createAction<UpdateTickerParams>('ticker/UPDATE')
export const getTicker = createAsyncAction('ticker/GET')
