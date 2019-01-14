import { getAsyncActions } from 'utils/redux'
import * as intlActions from './intl'
import * as identityActions from './identity'
import * as walletActions from './wallet'
import * as balanceActions from './balance'
import * as tickerActions from './ticker'
import * as portfolioActions from './portfolio'
import * as accountActions from './account'
import * as dappActions from './dapp'
import * as transactionActions from './transaction'
import * as addressActions from './address'
import * as utxoActions from './utxo'

export const asyncActions = getAsyncActions({
  ...identityActions,
  ...walletActions,
  ...accountActions,
  ...balanceActions,
  ...portfolioActions,
  ...tickerActions,
  ...intlActions,
  ...dappActions,
  ...transactionActions,
  ...addressActions,
  ...utxoActions
})
