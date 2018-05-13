import { combineReducers } from 'redux'
import intl from './intl'
import market from './market'
import ticker from './ticker'
import chart  from './chart'
import assets from './assets'
import wallet from './wallet'
import news from './news'
import balance from './balance'

export default combineReducers({
  intl,
  wallet,
  market,
  ticker,
  chart,
  assets,
  news,
  balance
})
