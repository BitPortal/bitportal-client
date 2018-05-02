import { createSelector } from 'reselect'

const tickerSelector = (state: RootState) => state.ticker
const exchangeFilterSelector = (state: RootState) => state.ticker.get('exchangeFilter')
const currencyFilterSelector = (state: RootState) => state.ticker.get('currencyFilter')
const quoteAssetFilterSelector = (state: RootState) => state.ticker.get('quoteAssetFilter')
const sortFilterSelector = (state: RootState) => state.ticker.get('sortFilter')

export const exchangeTickerSelector = createSelector(
  tickerSelector,
  exchangeFilterSelector,
  quoteAssetFilterSelector,
  sortFilterSelector,
  (ticker: any, exchange: any, quote_asset: any, sort: any) => {
    const sortfilter = sort.get(exchange)
    return ticker.set('sortFilter', sortfilter).set(
      'data', ticker.get('data').valueSeq()
        .filter((item: any) => item.get('exchange') === exchange)
        .filter((item: any) => item.get('quote_asset') === quote_asset)
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
