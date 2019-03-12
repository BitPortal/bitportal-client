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
import dapp from './dapp'
import address from './address'
import utxo from './utxo'
import transaction from './transaction'
import bridge from './bridge'

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
  address,
  utxo,
  transaction,
  bridge,
  ...createAsyncActionsReducers(asyncActions)
})
