import { createAction } from 'redux-actions'

export const getTickersRequested = createAction<TickerParams>('ticker/GET_REQUESTED')
export const getTickersSucceeded = createAction<TickerResult>('ticker/GET_SUCCEEDED')
export const getTickersFailed = createAction<ErrorMessage>('ticker/GET_FAILED')

export const selectTickersByExchange = createAction<TickerExchange>('ticker/SELECT_BY_EXCHANGE')
export const selectTickersByCurrency = createAction<string>('ticker/SELECT_BY_CURRENCY')
export const selectTickersByQuoteAsset = createAction<string>('ticker/SELECT_BY_QUOTE_ASSET')

export const selectBaseAsset = createAction<string>('ticker/SELECT_BASE_ASSET')