import { createSelector } from 'reselect'
import { activeWalletIdSelector, activeChainSelector } from 'selectors/wallet'

const activeAssetIdSelector = (state: RootState) => state.asset.activeAssetId
const transferAssetIdSelector = (state: RootState) => state.asset.transferAssetId
export const assetByIdSelector = (state: RootState) => state.asset.byId
const assetAllIdsSelector = (state: RootState) => state.asset.allIds

export const selectedAssetSelector = (state: RootState) => state.asset.selected

export const assetsSelector = createSelector(
  activeChainSelector,
  assetByIdSelector,
  assetAllIdsSelector,
  (chain: any, byId: any, allIds: any) => allIds.filter(item => item.indexOf(chain) === 0).map(id => byId[id])
)

export const activeAssetSelector = createSelector(
  activeAssetIdSelector,
  assetByIdSelector,
  (activeAssetId: any, byId: any) => {
    if (activeAssetId === 'BITCOIN/BTC') {
      return { chain: 'BITCOIN', symbol: 'BTC', precision: 8 }
    } else if  (activeAssetId === 'ETHEREUM/ETH') {
      return { chain: 'ETHEREUM', symbol: 'ETH', precision: 8 }
    } else if  (activeAssetId === 'EOS/EOS') {
      return { chain: 'EOS', symbol: 'EOS', precision: 8 }
    } else if (byId) {
      return byId[activeAssetId]
    }

    return null
  }
)

export const transferAssetSelector = createSelector(
  transferAssetIdSelector,
  assetByIdSelector,
  (transferAssetId: any, byId: any) => {
    if (transferAssetId === 'BITCOIN/BTC') {
      return { chain: 'BITCOIN', symbol: 'BTC', precision: 8 }
    } else if  (transferAssetId === 'ETHEREUM/ETH') {
      return { chain: 'ETHEREUM', symbol: 'ETH', precision: 8 }
    } else if  (transferAssetId === 'EOS/EOS') {
      return { chain: 'EOS', symbol: 'EOS', precision: 8 }
    } else if (byId) {
      return byId[transferAssetId]
    }

    return null
  }
)

export const selectedAssetIdsSelector = createSelector(
  activeWalletIdSelector,
  selectedAssetSelector,
  (activeWalletId: string, selectedAsset: any) => selectedAsset && selectedAsset[activeWalletId]
)

export const eosAssetAllIdsSelector = createSelector(
  assetAllIdsSelector,
  (assetAllIds: string) => assetAllIds.filter(item => item.indexOf('EOS/') === 0)
)

export const activeWalletSelectedAssetsSelector = createSelector(
  selectedAssetIdsSelector,
  assetByIdSelector,
  (selectedAssetIds: any, byId: any, ) => {
    if (selectedAssetIds && selectedAssetIds.length) {
      return selectedAssetIds.map(id => byId[id])
    }

    return null
  }
)
