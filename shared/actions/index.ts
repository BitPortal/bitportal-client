import { getAsyncActions } from 'utils/redux'
import * as intlActions from './intl'
import * as currencyActions from './currency'
import * as identityActions from './identity'
import * as walletActions from './wallet'
import * as balanceActions from './balance'
import * as tickerActions from './ticker'
import * as portfolioActions from './portfolio'
import * as accountActions from './account'
import * as keyAccountActions from './keyAccount'
import * as dappActions from './dapp'
import * as transactionActions from './transaction'
import * as addressActions from './address'
import * as utxoActions from './utxo'
import * as producerActions from './producer'
import * as contactActions from './contact'
import * as feeActions from './fee'
import * as assetActions from './asset'
import * as uiActions from './ui'
import * as depositActions from './deposit'

export const asyncActions = getAsyncActions({
  ...identityActions,
  ...walletActions,
  ...accountActions,
  ...balanceActions,
  ...portfolioActions,
  ...tickerActions,
  ...intlActions,
  ...currencyActions,
  ...dappActions,
  ...transactionActions,
  ...addressActions,
  ...utxoActions,
  ...keyAccountActions,
  ...producerActions,
  ...contactActions,
  ...feeActions,
  ...assetActions,
  ...uiActions,
  ...depositActions
})
