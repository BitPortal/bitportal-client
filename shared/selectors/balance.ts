import { createSelector } from 'reselect'
import { Map } from 'immutable'

const accountSelector = (state: RootState) => state.wallet.get('active').get('name')
const balancerSelector = (state: RootState) => state.balance

export const accountBalanceSelector = createSelector(
  accountSelector,
  balancerSelector,
  (name: string, balance: any) => balance.update(
    'data',
    (v: any) => {
      const index = v.findIndex((item: any) => item.get('eosAccountName') === name)

      return index === -1 ? Map({}) : v.get(index)
    }
  )
)
