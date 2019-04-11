import { getAsyncActions } from 'utils/redux'
import * as intlActions from './intl'
import * as identityActions from './identity'
import * as walletActions from './wallet'
import * as balanceActions from './balance'
import * as tickerActions from './ticker'
import * as portfolioActions from './portfolio'
import * as accountActions from './account'
import * as keyAccountActions from './keyAccount'
import * as dappActions from './dapp'
import * as newsActions from './news'
import * as transactionActions from './transaction'
import * as addressActions from './address'
import * as utxoActions from './utxo'
import * as producerActions from './producer'

export const asyncActions = getAsyncActions({
  ...identityActions,
  ...walletActions,
  ...accountActions,
  ...balanceActions,
  ...portfolioActions,
  ...tickerActions,
  ...intlActions,
  ...dappActions,
  ...newsActions,
  ...transactionActions,
  ...addressActions,
  ...utxoActions,
  ...keyAccountActions,
  ...producerActions
})
