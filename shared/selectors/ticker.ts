import { createSelector } from 'reselect'

const dataSourceSelector = (state: RootState) => state.ticker.get('dataSource')
const exchangeFilterSelector = (state: RootState) => state.ticker.get('exchangeFilter')
const currencyFilterSelector = (state: RootState) => state.ticker.get('currencyFilter')
const quoteAssetFilterSelector = (state: RootState) => state.ticker.get('quoteAssetFilter')
const sortFilterListSelector = (state: RootState) => state.ticker.get('sortFilter')
export const eosPriceSelector = (state: RootState) => !!state.ticker.get('data').get('BINANCE_SPOT_EOS_USDT') ? state.ticker.get('data').get('BINANCE_SPOT_EOS_USDT').get('price_last') : 0

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
  (ticker: any, exchange: any, quote_asset: any, sortfilter: any) => {
    return ticker.valueSeq()
        .filter((item: any) => item.get('exchange') === exchange)
        .filter((item: any) => item.get('quote_asset') === quote_asset)
        .sortBy((item: any) => -+item.get(sortfilter))
  }
)

export const currencyTickerSelector = createSelector(
  dataSourceSelector,
  currencyFilterSelector,
  (ticker: any, currency: any) => ticker.valueSeq().filter((item: any) => item.get('base_asset') === currency)
)
