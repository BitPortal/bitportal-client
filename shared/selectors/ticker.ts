import { createSelector } from 'reselect'

const dataSourceSelector = (state: RootState) => state.ticker.get('dataSource')
const exchangeFilterSelector = (state: RootState) => state.ticker.get('exchangeFilter')
const currencyFilterSelector = (state: RootState) => state.ticker.get('currencyFilter')
const quoteAssetFilterSelector = (state: RootState) => state.ticker.get('quoteAssetFilter')
const sortFilterListSelector = (state: RootState) => state.ticker.get('sortFilter')
const baseAssetSelector = (state: RootState) => state.ticker.get('baseAsset')
const searchTermSelector = (state: RootState) => state.ticker.get('searchTerm')

export const eosPriceSelector = (state: RootState) => (state.ticker.get('dataSource').get('BINANCE_SPOT_EOS_USDT')
  ? state.ticker
    .get('dataSource')
    .get('BINANCE_SPOT_EOS_USDT')
    .get('price_last')
  : 0)

export const sortFilterSelector = createSelector(
  sortFilterListSelector,
  exchangeFilterSelector,
  (sort: any, exchange: any) => sort.get(exchange)
)

export const exchangeTickerSelector = createSelector(
  dataSourceSelector,
  exchangeFilterSelector,
  quoteAssetFilterSelector,
  sortFilterSelector,
  searchTermSelector,
  (
    ticker: any,
    exchange: any,
    quote_asset: any,
    sortfilter: any,
    searchTerm: any
  ) => ticker
    .valueSeq()
    .filter((item: any) => item.get('exchange') === exchange)
    .filter((item: any) => item.get('quote_asset') === quote_asset)
    .filter(
      (item: any) => (searchTerm.trim() === ''
        ? item
        : item.get('base_asset').includes(searchTerm.toUpperCase()))
    )
    .sortBy((item: any) => {
      const result = exchangeTickerSortByHelper(sortfilter)
      return sortfilter.includes('low')
        ? +item.get(result)
        : -+item.get(result)
    })
)

const exchangeTickerSortByHelper = (filter: any) => {
  const filters = {
    quote_volume: 'quote_volume',
    price_change_percent_low: 'price_change_percent',
    price_change_percent_high: 'price_change_percent',
    current_price_low: 'price_last',
    current_price_high: 'price_last'
  }
  return filters[filter]
}

export const currencyTickerSelector = createSelector(
  dataSourceSelector,
  currencyFilterSelector,
  (ticker: any, currency: any) => ticker.valueSeq().filter((item: any) => item.get('base_asset') === currency)
)

export const tokenTickerSelector = createSelector(
  dataSourceSelector,
  baseAssetSelector,
  (ticker: any, base_asset: any) => ticker
    .valueSeq()
    .filter((item: any) => item.get('base_asset') === base_asset)
)
