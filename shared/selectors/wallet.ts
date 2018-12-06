import { createSelector } from 'reselect'
import { getPermissionsByKey } from 'core/eos'
import Immutable from 'immutable'

export const hasEOSAccountSelector = (state: RootState) => !!state.wallet.getIn(['data', 'eosAccountName'])
const walletSelector = (state: RootState) => state.wallet.get('data')
const eosAccountListSelector = (state: RootState) => state.eosAccount.get('eosAccountList')
const classicWalletListSelector = (state: RootState) => state.wallet.get('classicWalletList')

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

export const walletListSelector = createSelector(
  currenctWalletSelector,
  eosAccountListSelector,
  classicWalletListSelector,
  (activeWallet: any, eosAccountList: any, classicWalletList: any) => {
    // console.log('###--yy', activeWallet.toJS(), eosAccountList.toJS(), classicWalletList.toJS())
    const list: any = []
    classicWalletList.map((walletItem: any) => {
      const index = eosAccountList.findIndex((v: any) => v.get('account_name') === walletItem.get('eosAccountName').toLowerCase())
      if (index !== -1) {
        if (walletItem.get('eosAccountName') === activeWallet.get('account') && walletItem.get('permission').toLowerCase() === activeWallet.get('permission')) {
          const permissions = getPermissionsByKey(walletItem.get('publicKey'), eosAccountList.get(index).toJS())
          if (permissions.length > 0) {
            const index = permissions.findIndex((v: any) => v.permission === walletItem.get('permission').toLowerCase())
            index !== -1 && list.push(walletItem.set('balance', permissions[index].balance).set('active', true))
          }
        } else {
          const permissions = getPermissionsByKey(walletItem.get('publicKey'), eosAccountList.get(index).toJS())
          if (permissions.length > 0) {
            const index = permissions.findIndex((v: any) => v.permission === walletItem.get('permission').toLowerCase())
            index !== -1 && list.push(walletItem.set('balance', permissions[index].balance).set('active', false))
          }
        }
      }
    })
    // console.log('###--yy', list)
    return Immutable.fromJS(list)
  }
)
