import { createSelector } from 'reselect'
import { activeAssetContractSelector } from 'selectors/balance'

export const transferTransactionsSelector = (state: RootState) => state.transaction.get('data').filter((transaction: any) => transaction.getIn(['action_trace', 'act', 'name']) === 'transfer')

export const activeAssetTransactionsSelector = createSelector(
  activeAssetContractSelector,
  transferTransactionsSelector,
  (contract: string, transactions: any) => transactions.filter((v: any) => v.getIn(['action_trace', 'act', 'account']) === contract)
)
