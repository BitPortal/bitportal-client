import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form/immutable'
import intl from './intl'
import ticker from './ticker'
import chart from './chart'
import wallet from './wallet'
import eosAccount from './eosAccount'
import keystore from './keystore'
import news from './news'
import balance from './balance'
import producer from './producer'
import version from './version'
import currency from './currency'
import voting from './voting'
import transfer from './transfer'
import transaction from './transaction'
import bandwidth from './bandwidth'
import ram from './ram'
import token from './token'
import eosAsset from './eosAsset'
import dApp from './dApp'
import contact from './contact'
import eosNode from './eosNode'
import dappBrowser from './dappBrowser'

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
  version,
  currency,
  voting,
  bandwidth,
  ram,
  transfer,
  transaction,
  token,
  eosAsset,
  dApp,
  contact,
  eosNode,
  dappBrowser
})
