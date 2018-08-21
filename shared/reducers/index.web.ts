import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
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

export default combineReducers({
  router,
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
  eosNode
})
