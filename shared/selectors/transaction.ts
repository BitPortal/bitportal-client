import { createSelector } from 'reselect'
import { activeWalletSelector, transferWalletSelector } from 'selectors/wallet'
import { activeAssetSelector, transferAssetSelector } from 'selectors/asset'

export const transactionSelector = (state: RootState) => state.transaction
export const activeTransactionIdSelector = (state: RootState) => state.transaction.activeTransactionId
export const transferTransactionIdSelector = (state: RootState) => state.transaction.transferTransactionId

export const activeWalletTransactionsByIdSelector = createSelector(
  activeWalletSelector,
  transactionSelector,
  (activeWallet: string, transaction: any) => {
    if (activeWallet) {
      const { chain, address } = activeWallet
      const id = `${chain}/${address}`
      const activeWalletTransaction = transaction.byId[id]

      if (activeWalletTransaction) {
        return activeWalletTransaction.items.byId
      }
    }

    return null
  }
)

export const activeWalletAssetTransactionsByIdSelector = createSelector(
  activeWalletSelector,
  activeAssetSelector,
  transactionSelector,
  (activeWallet: string, activeAsset: string, transaction: any) => {
    if (activeWallet) {
      if (activeAsset) {
        const { chain, address } = activeWallet
        const activeAssetAddress = activeAsset.address || activeAsset.account
        const id = `${chain}/${address}/${activeAssetAddress}/${activeAsset.symbol}`
        const activeWalletTransaction = transaction.byId[id]

        if (activeWalletTransaction) {
          return activeWalletTransaction.items.byId
        }
      } else {
        const { chain, address } = activeWallet
        const id = `${chain}/${address}`
        const activeWalletTransaction = transaction.byId[id]

        if (activeWalletTransaction) {
          return activeWalletTransaction.items.byId
        }
      }
    }

    return null
  }
)

export const activeWalletTransactionsSelector = createSelector(
  activeWalletSelector,
  transactionSelector,
  (activeWallet: string, transaction: any) => {
    if (activeWallet) {
      const { chain, address } = activeWallet
      const id = `${chain}/${address}`
      const activeWalletTransaction = transaction.byId[id]

      if (activeWalletTransaction) {
        return activeWalletTransaction.items.allIds.map((item: any) => activeWalletTransaction.items.byId[typeof item === 'string' ? item : item.id])
      }
    }

    return null
  }
)

export const activeWalletTransactionSelector = createSelector(
  activeWalletTransactionsByIdSelector,
  activeTransactionIdSelector,
  (transactions: string, id: any) => {
    if (transactions && id) {
      return transactions[id]
    }

    return null
  }
)

export const transferWalletTransactionsByIdSelector = createSelector(
  transferWalletSelector,
  transactionSelector,
  (transferWallet: string, transaction: any) => {
    if (transferWallet) {
      const { chain, address } = transferWallet
      const id = `${chain}/${address}`
      const transferWalletTransaction = transaction.byId[id]

      if (transferWalletTransaction) {
        return transferWalletTransaction.items.byId
      }
    }

    return null
  }
)

export const transferWalletTransactionsSelector = createSelector(
  transferWalletSelector,
  transactionSelector,
  (transferWallet: string, transaction: any) => {
    if (transferWallet) {
      const { chain, address } = transferWallet
      const id = `${chain}/${address}`
      const transferWalletTransaction = transaction.byId[id]

      if (transferWalletTransaction) {
        return transferWalletTransaction.items.allIds.map((item: any) => transferWalletTransaction.items.byId[typeof item === 'string' ? item : item.id])
      }
    }

    return null
  }
)

export const transferWalletTransactionSelector = createSelector(
  transferWalletTransactionsByIdSelector,
  activeTransactionIdSelector,
  (transactions: string, id: any) => {
    if (transactions && id) {
      return transactions[id]
    }

    return null
  }
)
