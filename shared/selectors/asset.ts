import { createSelector } from 'reselect'

const activeAssetIdSelector = (state: RootState) => state.asset.activeAssetId
const assetByIdSelector = (state: RootState) => state.asset.byId
const assetAllIdsSelector = (state: RootState) => state.asset.allIds

export const selectedAssetSelector = (state: RootState) => state.asset.selected

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
