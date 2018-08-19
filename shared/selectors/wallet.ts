export const hasEOSAccountSelector = (state: RootState) => !!state.wallet.getIn(['data', 'eosAccountName'])
