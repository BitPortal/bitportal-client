import { createSelector } from 'reselect'
import { Map } from 'immutable'

const accountSelector = (state: RootState) => state.wallet.get('data').get('eosAccountName')
const balancerSelector = (state: RootState) => state.balance

export const accountBalanceSelector = createSelector(
  accountSelector,
  balancerSelector,
  (name: string, balance: any) => balance.update(
    'data',
    (v: any) => {
      if (!name) return Map({})
      const index = v.findIndex((item: any) => item.get('eosAccountName') === name)

      return index === -1 ? Map({}) : v.get(index)
    }
  )
)
