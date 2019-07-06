import { createSelector } from 'reselect'
import { activeWalletSelector, transferWalletSelector } from 'selectors/wallet'
import { activeAssetSelector, transferAssetSelector } from 'selectors/asset'
import { initialState } from 'reducers/transaction'

export const transactionSelector = (state: RootState) => state.transaction || initialState
export const activeTransactionIdSelector = (state: RootState) => state.transaction.activeTransactionId || initialState.activeTransactionId
export const transferTransactionIdSelector = (state: RootState) => state.transaction.transferTransactionId || initialState.transferTransactionId

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
        if (activeAsset.contract && activeWallet.chain === activeAsset.chain && activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`]) {
          return activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`].items.byId
        } else if (activeWallet.symbol === activeAsset.symbol && activeWallet.chain === activeAsset.chain && activeWalletTransaction.syscoin) {
          return activeWalletTransaction.syscoin.items.byId
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
        if (activeAsset.contract && activeWallet.chain === activeAsset.chain && activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`]) {
          return activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`].items.allIds.map((item: any) => activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`].items.byId[typeof item === 'string' ? item : item.id])
        } else if (activeWallet.symbol === activeAsset.symbol && activeWallet.chain === activeAsset.chain && activeWalletTransaction.syscoin) {
          return activeWalletTransaction.syscoin.items.allIds.map((item: any) => activeWalletTransaction.syscoin.items.byId[typeof item === 'string' ? item : item.id])
        }
      }
    }

    return null
  }
)

export const activeWalletTransactionsPaginationSelector = createSelector(
  activeWalletSelector,
  activeAssetSelector,
  transactionSelector,
  (activeWallet: any, activeAsset: any, transaction: any) => {
    if (activeWallet) {
      const { chain, address } = activeWallet
      const id = `${chain}/${address}`
      const activeWalletTransaction = transaction.byId[id]

      if (activeWalletTransaction) {
        if (activeAsset.contract && activeWallet.chain === activeAsset.chain && activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`]) {
          return activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`].pagination
        } else if (activeWallet.symbol === activeAsset.symbol && activeWallet.chain === activeAsset.chain && activeWalletTransaction.syscoin) {
          return activeWalletTransaction.syscoin.pagination
        }
      }
    }

    return null
  }
)

export const activeWalletTransactionsLoadingMoreSelector = createSelector(
  activeWalletSelector,
  activeAssetSelector,
  transactionSelector,
  (activeWallet: any, activeAsset: any, transaction: any) => {
    if (activeWallet) {
      const { chain, address } = activeWallet
      const id = `${chain}/${address}`
      const activeWalletTransaction = transaction.byId[id]

      if (activeWalletTransaction) {
        if (activeAsset.contract && activeWallet.chain === activeAsset.chain && activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`]) {
          return activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`].loadingMore
        } else if (activeWallet.symbol === activeAsset.symbol && activeWallet.chain === activeAsset.chain && activeWalletTransaction.syscoin) {
          return activeWalletTransaction.syscoin.loadingMore
        }
      }
    }

    return null
  }
)


export const activeWalletTransactionsCanLoadMoreSelector = createSelector(
  activeWalletSelector,
  activeAssetSelector,
  transactionSelector,
  (activeWallet: any, activeAsset: any, transaction: any) => {
    if (activeWallet) {
      const { chain, address } = activeWallet
      const id = `${chain}/${address}`
      const activeWalletTransaction = transaction.byId[id]

      if (activeWalletTransaction) {
        if (activeAsset.contract && activeWallet.chain === activeAsset.chain && activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`]) {
          return activeWalletTransaction[`${activeAsset.contract}/${activeAsset.symbol}`].canLoadMore
        } else if (activeWallet.symbol === activeAsset.symbol && activeWallet.chain === activeAsset.chain && activeWalletTransaction.syscoin) {
          return activeWalletTransaction.syscoin.canLoadMore
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
        if (transferAsset.contract && transferWallet.chain === transferAsset.chain && transferWalletTransaction[`${transferAsset.contract}/${transferAsset.symbol}`]) {
          return transferWalletTransaction[`${transferAsset.contract}/${transferAsset.symbol}`].items.byId
        } else if (transferWallet.symbol === transferAsset.symbol && transferWallet.chain === transferAsset.chain && transferWalletTransaction.syscoin) {
          return transferWalletTransaction.syscoin.items.byId
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
        if (transferAsset.contract && transferWallet.chain === transferAsset.chain && transferWalletTransaction[`${transferAsset.contract}/${transferAsset.symbol}`]) {
          return transferWalletTransaction[`${transferAsset.contract}/${transferAsset.symbol}`].items.allIds.map((item: any) => transferWalletTransaction[`${transferAsset.contract}/${transferAsset.symbol}`].items.byId[typeof item === 'string' ? item : item.id])
        } else if (transferWallet.symbol === transferAsset.symbol && transferWallet.chain === transferAsset.chain && transferWalletTransaction.syscoin) {
          return transferWalletTransaction.syscoin.items.allIds.map((item: any) => transferWalletTransaction.syscoin.items.byId[typeof item === 'string' ? item : item.id])
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
