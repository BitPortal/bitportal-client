import { createSelector } from 'reselect'
import { activeWalletIdSelector, activeChainSelector } from 'selectors/wallet'

const activeAssetIdSelector = (state: RootState) => state.asset.activeAssetId
const assetByIdSelector = (state: RootState) => state.asset.byId
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
    if (byId) {
      return byId[activeAssetId]
    }

    return null
  }
)

export const transferAssetSelector = createSelector(
  activeAssetIdSelector,
  assetByIdSelector,
  (activeAssetId: any, byId: any) => {
    if (byId) {
      return byId[activeAssetId]
    }

    return null
  }
)

export const selectedAssetIdsSelector = createSelector(
  activeWalletIdSelector,
  selectedAssetSelector,
  (activeWalletId: string, selectedAsset: any, ) => selectedAsset[activeWalletId]
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
