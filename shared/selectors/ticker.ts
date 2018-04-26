import { createSelector } from 'reselect'

const tickerSelector = (state: RootState) => state.ticker
const exchangeFilterSelector = (state: RootState) => state.ticker.get('exchangeFilter')
const currencyFilterSelector = (state: RootState) => state.ticker.get('currencyFilter')

export const exchangeTickerSelector = createSelector(
  tickerSelector,
  exchangeFilterSelector,
  (ticker: any, exchange: any) => ticker.set(
    'data', ticker.get('data').valueSeq().filter((item: any) => item.get('exchange') === exchange)
  )
)

export const currencyTickerSelector = createSelector(
  tickerSelector,
  currencyFilterSelector,
  (ticker: any, currency: any) => ticker.set(
    'data', ticker.get('data').valueSeq().filter((item: any) => item.get('base_asset') === currency)
  )
)
