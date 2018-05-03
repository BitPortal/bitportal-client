import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import { QUOTE_ASSETS } from 'constants/market'
import * as actions from 'actions/ticker'

const initialState = Immutable.fromJS({
  data: {},
  loading: false,
  loaded: false,
  error: null,
  exchangeFilter: 'BINANCE',
  quoteAssetFilter: QUOTE_ASSETS.BINANCE[0],
  sortFilter: {
    BINANCE: 'quote_volume',
    BITTREX: 'quote_volume',
    OKEX: 'quote_volume',
    HUOBIPRO: 'quote_volume',
    POLONIEX: 'quote_volume',
  },
  currencyFilter: null,
  baseAsset: null
})

export default handleActions({
  [actions.getTickersRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getTickersSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .update(
        'data',
        (v: any) => {
          const tickers = action.payload
          let newData = v

          for (const ticker of tickers) {
            const { symbol, ...data } = ticker
            newData = newData.set(symbol, Immutable.fromJS(data))
          }

          return newData
        }
      )
  },
  [actions.getTickersFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.selectTickersByExchange] (state, action) {
    return state.set('exchangeFilter', action.payload)
      .set('quoteAssetFilter', QUOTE_ASSETS[action.payload][0])
  },
  [actions.selectTickersByQuoteAsset] (state, action) {
    return state .set('quoteAssetFilter', action.payload)
  },
  [actions.selectTickersByCurrency] (state, action) {
    return state.set('currencyFilter', action.payload)
  },
  [actions.selectBaseAsset] (state, action) {
    return state.set('baseAsset', action.payload)
  }
}, initialState)
