import { createSelector } from 'reselect'
import { activeWalletIdSelector, activeChainSelector } from 'selectors/wallet'
import { initialState } from 'reducers/asset'

const activeAssetIdSelector = (state: RootState) => state.asset.activeAssetId || initialState.activeAssetId
const transferAssetIdSelector = (state: RootState) => state.asset.transferAssetId || initialState.transferAssetId
export const assetByIdSelector = (state: RootState) => state.asset.byId || initialState.byId
const assetAllIdsSelector = (state: RootState) => state.asset.allIds || initialState.allIds
export const assetSearchTextSelector = (state: RootState) => state.asset.searchText || initialState.searchText
export const selectedAssetSelector = (state: RootState) => state.asset.selected || initialState.selected

export const assetsSelector = createSelector(
  activeChainSelector,
  assetByIdSelector,
  assetAllIdsSelector,
  (chain: any, byId: any, allIds: any, searchText: string) => {
    if (chain === 'ETHEREUM') {
      return allIds.filter(item => item.indexOf(chain) === 0).map(id => byId[id]).filter(item => item.display_priority > 0)
    }

    return allIds.filter(item => item.indexOf(chain) === 0).map(id => byId[id])
  }
)

export const assetsWithSearchSelector = createSelector(
  activeChainSelector,
  assetByIdSelector,
  assetAllIdsSelector,
  assetSearchTextSelector,
  (chain: any, byId: any, allIds: any, searchText: string) => {
    if (searchText) {
      return allIds.filter(item => item.indexOf(chain) === 0).map(id => byId[id])
        .filter(item => (item.symbol && item.symbol.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) || (item.name && item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) || (item.contract && item.contract.toLowerCase().indexOf(searchText.toLowerCase()) !== -1))
    } else {
      if (chain === 'ETHEREUM') {
        return allIds.filter(item => item.indexOf(chain) === 0).map(id => byId[id]).filter(item => item.display_priority > 0)
      }

      return allIds.filter(item => item.indexOf(chain) === 0).map(id => byId[id])
    }
  }
)

export const assetsSearchSelector = createSelector(
  activeChainSelector,
  assetByIdSelector,
  assetAllIdsSelector,
  assetSearchTextSelector,
  (chain: any, byId: any, allIds: any, searchText: string) => {
    if (searchText) {
      return allIds.filter(item => item.indexOf(chain) === 0).map(id => byId[id])
        .filter(item => (item.symbol && item.symbol.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) || (item.name && item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) || (item.contract && item.contract.toLowerCase().indexOf(searchText.toLowerCase()) !== -1))
    } else {
      return []
    }
  }
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
      return { chain: 'EOS', symbol: 'EOS', precision: 4 }
    } else if  (activeAssetId === 'CHAINX/PCX') {
      return { chain: 'CHAINX', symbol: 'PCX', precision: 8 }
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
      return { chain: 'EOS', symbol: 'EOS', precision: 4 }
    } else if (transferAssetId === 'CHAINX/PCX') {
      return { chain: 'CHAINX', symbol: 'PCX', precision: 8 }
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
