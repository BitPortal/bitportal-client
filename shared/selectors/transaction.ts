export const transferTransactionsSelector = (state: RootState) => state.transaction.get('data').filter((transaction: any) => transaction.getIn(['action_trace', 'act', 'name']) === 'transfer')
