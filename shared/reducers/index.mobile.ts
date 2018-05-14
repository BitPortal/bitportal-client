import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form/es/immutable'
import intl from './intl'
import market from './market'
import ticker from './ticker'
import chart  from './chart'
import wallet from './wallet'
import news from './news'
import balance from './balance'

export default combineReducers({
  form,
  intl,
  wallet,
  market,
  ticker,
  chart,
  news,
  balance
})
