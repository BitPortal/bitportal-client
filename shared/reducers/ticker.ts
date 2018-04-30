import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/ticker'

const initialState = Immutable.fromJS({
  data: {},
  loading: false,
  loaded: false,
  isRefreshing: false,
  error: null,
  exchangeFilter: 'BITTREX',
  sortFilter: {
    BITTREX: 'quote_volume'
  },
  currencyFilter: null
})

export default handleActions({
  [actions.getTickersRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getTickersSucceeded] (state, action) {
    return state.set('loading', false).set('loaded', true)
      .update(
        'data',
        () => {
          const tickers = action.payload
          
          let newData = Immutable.Map({})

          for (const ticker of tickers) {
            const { symbol, ...data } = ticker
            newData = newData.set(symbol, Immutable.fromJS(data))
          }

          return newData
        }
      )
  },
  [actions.getTickersFailed] (state, action) {
    return state.set('loading', false).set('error', action.payload)
  },
  [actions.selectTickersByExchange] (state, action) {
    return state.set('exchangeFilter', action.payload)
  },
  [actions.selectTickersByCurrency] (state, action) {
    return state.set('currencyFilter', action.payload)
  },
  [actions.startToRefreshTicker] (state) {
    return state.set('isRefreshing', true)
  }
}, initialState)
