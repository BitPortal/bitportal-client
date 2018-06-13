import { combineReducers } from 'redux'
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
import versionInfo from './versionInfo'
import voting from './voting'


export default combineReducers({
  form,
  intl,
  wallet,
  eosAccount,
  keystore,
  ticker,
  chart,
  news,
  balance,
  producer,
  versionInfo,
  voting
})
