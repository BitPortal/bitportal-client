import { createSelector } from 'reselect'
import { activeAssetSelector } from 'selectors/balance'

export const transferTransactionsSelector = (state: RootState) => state.transaction.get('data').filter((transaction: any) => transaction.getIn(['action_trace', 'act', 'name']) === 'transfer')

export const activeAssetTransactionsSelector = createSelector(
  activeAssetSelector,
  transferTransactionsSelector,
  (activeAsset: any, transactions: any) => {
    const contract = activeAsset.get('contract')
    const symbol = activeAsset.get('symbol')

    return transactions.filter((v: any) => v.getIn(['action_trace', 'act', 'account']) === contract && v.getIn(['action_trace', 'act', 'data', 'quantity']) && v.getIn(['action_trace', 'act', 'data', 'quantity']).indexOf(symbol) !== -1)
  }
)
