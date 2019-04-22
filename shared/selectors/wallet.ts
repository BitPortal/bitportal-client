import { createSelector } from 'reselect'

export const activeWalletIdSelector = (state: RootState) => state.wallet.activeWalletId
export const managingWalletIdSelector = (state: RootState) => state.wallet.managingWalletId
export const transferWalletIdSelector = (state: RootState) => state.wallet.transferWalletId

const identityWalletByIdSelector = (state: RootState) => state.wallet.identityWallets.byId
const identityWalletAllIdsSelector = (state: RootState) => state.wallet.identityWallets.allIds

const importedWalletByIdSelector = (state: RootState) => state.wallet.importedWallets.byId
const importedWalletAllIdsSelector = (state: RootState) => state.wallet.importedWallets.allIds

export const walletAllIdsSelector = createSelector(
  identityWalletAllIdsSelector,
  importedWalletAllIdsSelector,
  (identityWallet: string, importedWallet: any) => [...identityWallet, ...importedWallet]
)

export const walletByIdSelector = createSelector(
  identityWalletByIdSelector,
  importedWalletByIdSelector,
  (identityWallet: string, importedWallet: any) => ({
    ...identityWallet,
    ...importedWallet
  })
)

export const activeWalletSelector = createSelector(
  activeWalletIdSelector,
  identityWalletByIdSelector,
  importedWalletByIdSelector,
  (activeWalletId: string, identityWallets: any, importedWallets: any) => activeWalletId && (identityWallets[activeWalletId] || importedWallets[activeWalletId])
)

export const managingWalletSelector = createSelector(
  managingWalletIdSelector,
  identityWalletByIdSelector,
  importedWalletByIdSelector,
  (managingWalletId: string, identityWallets: any, importedWallets: any) => managingWalletId && (identityWallets[managingWalletId] || importedWallets[managingWalletId])
)

export const transferWalletSelector = createSelector(
  transferWalletIdSelector,
  identityWalletByIdSelector,
  importedWalletByIdSelector,
  (transferWalletId: string, identityWallets: any, importedWallets: any) => transferWalletId && (identityWallets[transferWalletId] || importedWallets[transferWalletId])
)

export const identityWalletSelector = createSelector(
  identityWalletByIdSelector,
  identityWalletAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
)

export const hasIdentityEOSWalletSelector = createSelector(
  identityWalletSelector,
  (identityWallets: any) => {
    if (identityWallets && identityWallets.length) {
      const index = identityWallets.findIndex((wallet: any) => wallet.chain === 'EOS')
      return !!identityWallets[index].address
    }

    return false
  }
)

export const identityEOSWalletSelector = createSelector(
  identityWalletSelector,
  (identityWallet: any) => {
    const index = identityWallet.findIndex(wallet => wallet.chain === 'EOS')

    return index !== -1 ? identityWallet[index] : null
  }
)

export const identityEOSAccountsSelector = createSelector(
  identityEOSWalletSelector,
  (identityWallet: any) => {
    return identityWallet && identityWallet.accounts
  }
)

export const importedWalletSelector = createSelector(
  importedWalletByIdSelector,
  importedWalletAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
)

export const walletAddressesSelector = createSelector(
  identityWalletSelector,
  importedWalletSelector,
  (identityWallets: any, importedWallets: any) => identityWallets.concat(importedWallets).map((wallet: any) => wallet.address).filter((address: string) => !!address)
)

export const eosAccountSelector = createSelector(
  identityWalletSelector,
  importedWalletSelector,
  (identityWallets: any, importedWallets: any) => identityWallets.concat(importedWallets).filter((wallet) => wallet.chain === 'EOS').map((wallet: any) => wallet.address).filter((address: string) => !!address)
)
