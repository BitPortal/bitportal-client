import { createSelector } from 'reselect'

const tickerSelector = (state: RootState) => state.ticker
const exchangeFilterSelector = (state: RootState) => state.ticker.get('exchangeFilter')
const currencyFilterSelector = (state: RootState) => state.ticker.get('currencyFilter')
const sortFilterSelector = (state: RootState) => state.ticker.get('sortFilter')

export const exchangeTickerSelector = createSelector(
  tickerSelector,
  exchangeFilterSelector,
  sortFilterSelector,
  (ticker: any, exchange: any, sort: any) => {
    const sortfilter = sort.get(exchange) || 'quote_volume'
    return ticker.set(
    'data', ticker.get('data').valueSeq()
      .filter((item: any) => item.get('exchange') === exchange)
      .sortBy((item: any) => -+item.get(sortfilter))
    )
  }
)

export const currencyTickerSelector = createSelector(
  tickerSelector,
  currencyFilterSelector,
  (ticker: any, currency: any) => ticker.set(
    'data', ticker.get('data').valueSeq().filter((item: any) => item.get('base_asset') === currency)
  )
)
