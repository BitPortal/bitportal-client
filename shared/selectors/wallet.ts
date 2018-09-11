import { createSelector } from 'reselect'
import { eosAccountSelector } from 'selectors/eosAccount'

export const hasEOSAccountSelector = (state: RootState) => !!state.wallet.getIn(['data', 'eosAccountName'])
const walletSelector = (state: RootState) => state.wallet.get('data')

export const currenctWalletSelector = createSelector(
  walletSelector,
  eosAccountSelector,
  (wallet: any, eosAccount: any) => {
    if (wallet.get('eosAccountName')) {
      return wallet
        .delete('timestamp')
        .delete('coin')
        .delete('origin')
        .set('account', wallet.get('eosAccountName'))
        .update('permission', (v: any) => v.toLowerCase())
        .delete('eosAccountName')
        .set('info', eosAccount.get('data'))
    }

    return null
  }
)
