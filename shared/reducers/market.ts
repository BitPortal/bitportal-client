import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as actions from 'actions/market'

/*
  * support exchanges: Binance,Bittrex,OKex,Huobipro,Poloniex,Gdax
  * support sortType:  quote_volume
  * support quotes: 
  *   -- binance: btc, eth, usdt, bnb
  *   -- okex   : btc, eth, usdt
**/ 

const initialState = Immutable.fromJS({
  selectedExchange: 'Bittrex', 
  selectedQuote: 'BTC',
  sortType: 'quote_volume',
  isRefreshing: true
})

export default handleActions({
  [actions.selectExchange] (state, action) {
    return state.set('selectedExchange', action.payload).set('isRefreshing', true)
  },
  [actions.selectQuote] (state, action) {
    return state.set('selectedQuote', action.payload).set('isRefreshing', true)
  },
  [actions.selectCoin] (state, action) {
    return state.set('selectedCoin', action.payload)
  },
  [actions.endToRefreshTicker] (state) {
    return state.set('isRefreshing', false)
  }
}, initialState)
