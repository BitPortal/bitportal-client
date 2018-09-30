import { createSelector } from 'reselect'

export const hasEOSAccountSelector = (state: RootState) => !!state.wallet.getIn(['data', 'eosAccountName'])
const walletSelector = (state: RootState) => state.wallet.get('data')

export const currenctWalletSelector = createSelector(
  walletSelector,
  (wallet: any) => {
    if (wallet.get('eosAccountName')) {
      return wallet
        .delete('timestamp')
        .delete('coin')
        .delete('origin')
        .set('account', wallet.get('eosAccountName'))
        .update('permission', (v: any) => v.toLowerCase())
        .delete('eosAccountName')
    }

    return null
  }
)
