import { combineReducers } from 'redux'
import intl from './intl'
import market from './market'
import ticker from './ticker'
import chart  from './chart'

export default combineReducers({
  intl,
  market,
  ticker,
  chart
})
