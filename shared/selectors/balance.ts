import { createSelector } from 'reselect'

const accountSelector = (state: RootState) => state.wallet.get('data').get('eosAccountName')
const balancerSelector = (state: RootState) => state.balance
const activeAssetSelector = (state: RootState) => state.balance.get('activeAsset')

export const eosAccountBalanceSelector = createSelector(
  accountSelector,
  balancerSelector,
  (name: string, balance: any) => name ? balance.get('data').filter((item: any) => item.get('eosAccountName') === name).getIn(['0', 'eosAccountBalance']) : null
)

export const eosAssetBalanceSelector = createSelector(
  activeAssetSelector,
  eosAccountBalanceSelector,
  (asset: string, balance: any) => (asset && balance) ? balance.filter((item: any) => item.get('symbol') === asset).get(0) : null
)
