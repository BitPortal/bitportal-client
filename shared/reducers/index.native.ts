import { combineReducers } from 'redux'
import { asyncActions } from 'actions'
import { createAsyncActionsReducers } from 'utils/redux'
import { reducer as form } from 'redux-form'
import intl from './intl'
import identity from './identity'
import wallet from './wallet'
import balance from './balance'
import ticker from './ticker'
import portfolio from './portfolio'
import account from './account'
import keyAccount from './keyAccount'
import dapp from './dapp'
import news from './news'
import address from './address'
import utxo from './utxo'
import transaction from './transaction'
import bridge from './bridge'
import producer from './producer'
import contact from './contact'

export default combineReducers({
  form,
  identity,
  wallet,
  balance,
  ticker,
  portfolio,
  account,
  intl,
  dapp,
  news,
  address,
  utxo,
  transaction,
  bridge,
  keyAccount,
  producer,
  contact,
  ...createAsyncActionsReducers(asyncActions)
})
