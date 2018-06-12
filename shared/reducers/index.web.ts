import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as form } from 'redux-form/es/immutable'
import intl from './intl'
import ticker from './ticker'
import chart  from './chart'
import wallet from './wallet'
import eosAccount from './eosAccount'
import keystore from './keystore'
import news from './news'
import balance from './balance'
import producer from './producer'

export default combineReducers({
  router,
  form,
  intl,
  wallet,
  eosAccount,
  keystore,
  ticker,
  news,
  balance,
  producer,
  chart
})
