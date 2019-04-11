import { createSelector } from 'reselect'
import { managingWalletSelector } from './wallet'

export const keyAccountByIdSelector = (state: RootState) => state.keyAccount.byId
export const keyAccountAllIdsSelector = (state: RootState) => state.keyAccount.allIds

export const managingWalletKeyAccountSelector = createSelector(
  managingWalletSelector,
  keyAccountByIdSelector,
  (wallet: any, byId: any) => {
    if (!byId || !wallet || wallet.chain !== 'EOS' || !wallet.address) return null
    const publicKeys = wallet.publicKeys
    const accounts = publicKeys.map((key: string) => `${wallet.chain}/${key}`).map((id: string) => byId[id] && byId[id].accounts).filter((accounts: any) => !!accounts).reduce((accouts: any, account:any) => [...accouts, ...account], [])

    const mergedAccounts = {}
    for (let i = 0; i < accounts.length; i++) {
      if (mergedAccounts[accounts[i].accountName]) {
        mergedAccounts[accounts[i].accountName].permissions = [...new Set([...mergedAccounts[accounts[i].accountName].permissions, ...accounts[i].permissions])]
      } else {
        mergedAccounts[accounts[i].accountName] = accounts[i]
      }
    }

    return Object.values(mergedAccounts)
  }
)
