import { List } from 'immutable'
import { createSelector } from 'reselect'
import { eosAccountNameSelector, eosCoreLiquidBalanceSelector } from 'selectors/eosAccount'
import { eosPriceSelector } from 'selectors/ticker'
import { selectedEOSAssetSelector } from 'selectors/eosAsset'

export const tokenBalanceAllDataSelector = (state: RootState) => state.balance.get('tokenBalance')
export const activeAssetSelector = (state: RootState) => state.balance.get('activeAsset')
export const activeAssetContractSelector = (state: RootState) => state.balance.getIn(['activeAsset', 'contract'])
export const eosBalanceAllDataSelector = (state: RootState) => state.balance.get('eosBalance')

export const eosBalanceInfoSelector = createSelector(
  eosAccountNameSelector,
  eosBalanceAllDataSelector,
  eosCoreLiquidBalanceSelector,
  (eosAccountName: string, eosBalance: any, eosCoreLiquidBalance: any) => {
    if (eosAccountName) {
      return eosBalance.get(eosAccountName) || eosCoreLiquidBalance
    }

    return null
  }
)

export const eosBalanceSelector = createSelector(
  eosBalanceInfoSelector,
  (eosBalanceInfo: any) => (eosBalanceInfo ? eosBalanceInfo.get('balance') : 0)
)

export const eosTokenBalanceSelector = createSelector(
  eosAccountNameSelector,
  tokenBalanceAllDataSelector,
  (eosAccountName: string, assetBalance: any) => (eosAccountName ? assetBalance.get(eosAccountName) : null)
)

export const selectedEOSTokenBalanceSelector = createSelector(
  eosTokenBalanceSelector,
  selectedEOSAssetSelector,
  (eosTokenBalance: any, selectedEOSAsset: any) =>
    selectedEOSAsset.map((v: any) => {
      if (eosTokenBalance) {
        const contract = v.get('contract')
        const symbol = v.get('symbol')
        const index = eosTokenBalance.findIndex(
          (v: any) => v.get('contract') === contract && v.get('symbol') === symbol
        )
        return index !== -1 ? v.set('balance', eosTokenBalance.getIn([index, 'balance'])) : v.set('balance', '0.0000')
      }

      return v.set('balance', '0.0000')
    })
)

export const eosAssetBalanceSelector = createSelector(
  eosBalanceInfoSelector,
  selectedEOSTokenBalanceSelector,
  (eosBalance: string, eosTokenBalance: any) => {
    if (eosBalance) {
      return eosTokenBalance ? eosTokenBalance.unshift(eosBalance) : List([eosBalance])
    }

    return null
  }
)

export const eosTotalAssetBalanceSelector = createSelector(
  eosBalanceInfoSelector,
  eosPriceSelector,
  (eosBalance: any, eosPrice: any) => (eosBalance && eosPrice ? +eosBalance.get('balance') * +eosPrice : 0)
)

export const activeAssetBalanceSelector = createSelector(
  eosAssetBalanceSelector,
  activeAssetSelector,
  (eosAssetBalance: any, activeAsset: any) => {
    if (eosAssetBalance) {
      const contract = activeAsset.get('contract')
      const symbol = activeAsset.get('symbol')
      const index = eosAssetBalance.findIndex((v: any) => v.get('contract') === contract && v.get('symbol') === symbol)
      return index !== -1 ? eosAssetBalance.getIn([index, 'balance']) : 0
    } else {
      return 0
    }
  }
)
