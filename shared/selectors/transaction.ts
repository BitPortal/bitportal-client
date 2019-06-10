import { createSelector } from 'reselect'
import { activeWalletSelector, transferWalletSelector } from 'selectors/wallet'
import { activeAssetSelector, transferAssetSelector } from 'selectors/asset'

export const transactionSelector = (state: RootState) => state.transaction
export const activeTransactionIdSelector = (state: RootState) => state.transaction.activeTransactionId
export const transferTransactionIdSelector = (state: RootState) => state.transaction.transferTransactionId

export const activeWalletTransactionsByIdSelector = createSelector(
  activeWalletSelector,
  activeAssetSelector,
  transactionSelector,
  (activeWallet: any, activeAsset: any, transaction: any) => {
    if (activeWallet) {
      const { chain, address } = activeWallet
      const id = `${chain}/${address}`
      const activeWalletTransaction = transaction.byId[id]

      if (activeWalletTransaction) {
        if (activeAsset.contract && activeWallet.symbol === activeAsset.symbol && activeWallet.chain === activeAsset.chain) {
          return activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`].items.byId
        } else {
          return activeWalletTransaction.basecoin.items.byId
        }
      }
    }

    return null
  }
)

export const activeWalletTransactionsSelector = createSelector(
  activeWalletSelector,
  activeAssetSelector,
  transactionSelector,
  (activeWallet: any, activeAsset: any, transaction: any) => {
    if (activeWallet) {
      const { chain, address } = activeWallet
      const id = `${chain}/${address}`
      const activeWalletTransaction = transaction.byId[id]

      if (activeWalletTransaction) {
        if (activeAsset.contract && activeWallet.symbol === activeAsset.symbol && activeWallet.chain === activeAsset.chain) {
          return activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`].items.allIds.map((item: any) => activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`].items.byId[typeof item === 'string' ? item : item.id])
        } else {
          return activeWalletTransaction.basecoin.items.allIds.map((item: any) => activeWalletTransaction.basecoin.items.byId[typeof item === 'string' ? item : item.id])
        }
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
  transferAssetSelector,
  transactionSelector,
  (transferWallet: any, transferAsset: any, transaction: any) => {
    if (transferWallet) {
      const { chain, address } = transferWallet
      const id = `${chain}/${address}`
      const transferWalletTransaction = transaction.byId[id]

      if (transferWalletTransaction) {
        if (transferAsset.contract && transferWallet.symbol === transferAsset.symbol && transferWallet.chain === transferAsset.chain) {
          return transferWalletTransaction[`${transferAsset.contract}/${transferAsset.symbol}`].items.byId
        } else {
          return transferWalletTransaction.basecoin.items.byId
        }
      }
    }

    return null
  }
)

export const transferWalletTransactionsSelector = createSelector(
  transferWalletSelector,
  transferAssetSelector,
  transactionSelector,
  (transferWallet: any, transferAsset: any, transaction: any) => {
    if (transferWallet) {
      const { chain, address } = transferWallet
      const id = `${chain}/${address}`
      const transferWalletTransaction = transaction.byId[id]

      if (transferWalletTransaction) {
        if (transferAsset.contract && transferWallet.symbol === transferAsset.symbol && transferWallet.chain === transferAsset.chain) {
          return transferWalletTransaction[`${transferAsset.contract}/${transferAsset.symbol}`].items.allIds.map((item: any) => transferWalletTransaction[`${transferAsset.contract}/${transferAsset.symbol}`].items.byId[typeof item === 'string' ? item : item.id])
        } else {
          return transferWalletTransaction.basecoin.items.allIds.map((item: any) => transferWalletTransaction.basecoin.items.byId[typeof item === 'string' ? item : item.id])
        }
      }
    }

    return null
  }
)

export const transferWalletTransactionSelector = createSelector(
  transferWalletTransactionsByIdSelector,
  transferTransactionIdSelector,
  (transactions: any, id: any) => {
    if (transactions && id) {
      return transactions[id]
    }

    return null
  }
)
