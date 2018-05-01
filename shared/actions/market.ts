import { createAction } from 'redux-actions'

export const selectExchange = createAction('market/SELECT_EXCHANGE')
export const selectQuote = createAction('market/SELECT_QUOTE')
export const selectCoin = createAction('market/SELECT_COIN')

export const startToRefreshTicker = createAction('market/START_TO_REFRESH_TICKER')
export const endToRefreshTicker = createAction('market/END_TO_REFRESH_TICKER')
