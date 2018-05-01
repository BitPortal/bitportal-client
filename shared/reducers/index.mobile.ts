import { combineReducers } from 'redux'
import intl from './intl'
import market from './market'
import ticker from './ticker'

export default combineReducers({
  intl,
  market,
  ticker
})
