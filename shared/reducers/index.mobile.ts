import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form/es/immutable'
import intl from './intl'
import market from './market'
import ticker from './ticker'
import chart  from './chart'
import wallet from './wallet'
import eosAccount from './eosAccount'
import keystore from './keystore'
import news from './news'
import balance from './balance'
import vote from './vote'

export default combineReducers({
  form,
  intl,
  wallet,
  eosAccount,
  keystore,
  market,
  ticker,
  chart,
  news,
  balance,
  vote
})
