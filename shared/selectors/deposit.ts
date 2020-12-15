import { createSelector } from 'reselect'
import { initialState } from 'reducers/deposit'
import { activeWalletSelector } from 'selectors/wallet'
import { activeWalletBalanceSelector, activeAssetBalanceSelector } from 'selectors/balance'

export const depositByIdSelector = (state: any) => state.deposit.byId || initialState.byId
export const depositAllIdsSelector = (state: any) => state.deposit.allIds || initialState.allIds

export const depositIdSelector = createSelector(
  activeWalletSelector,
  (wallet: any) => {
    return `${wallet && wallet.id}`
  }
)
export const activeDepositSelector = createSelector(
  depositIdSelector,
  depositByIdSelector,
  (depositId: any, byId: any) => {
    return byId[depositId] || {}
  }
)
