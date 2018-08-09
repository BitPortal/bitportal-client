import { createAction } from 'redux-actions'

export const getTickersRequested = createAction<TickerParams>(
  'ticker/GET_REQUESTED'
)
export const getTickersSucceeded = createAction<TickerResult>(
  'ticker/GET_SUCCEEDED'
)
export const getTickersFailed = createAction<ErrorMessage>('ticker/GET_FAILED')
export const getPairListedExchangeRequested = createAction<TickerParams>(
  'ticker/GET_PAIR_LISTED_EXCHANGE_REQUESTED'
)
export const getPairListedExchangeSucceeded = createAction<TickerResult>(
  'ticker/GET_PAIR_LISTED_EXCHANGE_SUCCEEDED'
)
export const getPairListedExchangeFailed = createAction<ErrorMessage>(
  'ticker/GET_PAIR_LISTED_EXCHANGE_FAILED'
)
export const selectTickersByExchange = createAction<TickerExchange>(
  'ticker/SELECT_BY_EXCHANGE'
)
export const selectTickersByCurrency = createAction<string>(
  'ticker/SELECT_BY_CURRENCY'
)
export const selectTickersByQuoteAsset = createAction<string>(
  'ticker/SELECT_BY_QUOTE_ASSET'
)
export const selectBaseAsset = createAction<string>('ticker/SELECT_BASE_ASSET')

export const deleteListedExchange = createAction(
  'ticker/DELETE_LISTED_EXCHANGE'
)

export const selectCurrentPair = createAction<string>(
  'ticker/SELECT_CURRENT_PAIR'
)

export const setSortFilter = createAction<string>('ticker/SET_SORT_FILTER')
