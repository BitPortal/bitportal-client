import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as actions from 'actions/drawer'

/*
  * support exchanges: Bittrex,OKex,Huobipro,Poloniex,Gdax
  * support sortType:  quote_volume,quote_
  * support quotes: 
  *   -- binance: btc, eth, usdt, bnb
  *   -- okex   : btc, eth, usdt
**/ 

const initialState = Immutable.fromJS({
  selectedExchange: 'Bittrex', 
  selectedQuote: 'BTC',
  sortType: 'quote_volume',
})

export default handleActions({
  [actions.selectExchange] (state, action) {
    return state.set('selectedExchange', action.payload)
  },
  [actions.selectQuote] (state, action) {
    return state.set('selectedQuote', action.payload)
  },
  [actions.selectCoin] (state, action) {
    return state.set('selectedCoin', action.payload)
  }
}, initialState)
