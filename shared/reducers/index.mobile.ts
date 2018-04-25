import { combineReducers } from 'redux'
import intl from './intl'
import drawer from './drawer'
import ticker from './ticker'

export default combineReducers({
  intl,
  drawer,
  ticker
})
