import { createSelector } from 'reselect'
import { activeWalletSelector } from 'selectors/wallet'

export const transactionSelector = (state: RootState) => state.transaction
export const activeTransactionIdSelector = (state: RootState) => state.transaction.activeTransactionId

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
