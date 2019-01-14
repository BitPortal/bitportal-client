import { createSelector } from 'reselect'

export const activeWalletIdSelector = (state: RootState) => state.wallet.activeWalletId

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
  (activeWalletId: string, identityWallets: any, importedWallets: any) => identityWallets[activeWalletId] || importedWallets[activeWalletId]
)

export const identityWalletSelector = createSelector(
  identityWalletByIdSelector,
  identityWalletAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
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
