import { createAction } from 'redux-actions'

export const getTickersRequested = createAction('ticker/GET_REQUESTED')
export const getTickersSucceeded = createAction<TickerResult>('ticker/GET_SUCCEEDED')
export const getTickersFailed = createAction<ErrorMessage>('ticker/GET_FAILED')

export const selectTickersByExchange = createAction<string>('ticker/SELECT_BY_EXCHANGE')
export const selectTickersByCurrency = createAction<string>('ticker/SELECT_BY_CURRENCY')
