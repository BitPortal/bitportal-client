import {createSelector} from 'reselect'
import {activeWalletIdSelector, activeChainSelector} from 'selectors/wallet'
import {initialState} from 'reducers/asset'
import { chain } from '../core/constants'

export const activeAssetIdSelector = (state: RootState) => state.asset.activeAssetId || initialState.activeAssetId
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

export const selectedAssetIdsSelector = createSelector(
  activeWalletIdSelector,
  selectedAssetSelector,
  (activeWalletId: string, selectedAsset: any) => {
    const wSelectd = selectedAsset && selectedAsset[activeWalletId]
    const result:any = [];
     (wSelectd || []).forEach(value => {
       if (value.select) {
         result.push(value.assetId)
       }

    })
    return result
  }
)

export const assetsWithSearchSelector = createSelector(
  activeChainSelector,
  assetByIdSelector,
  assetAllIdsSelector,
  assetSearchTextSelector,
  selectedAssetIdsSelector,
  (chain: any, byId: any, allIds: any, searchText: string, selectedAssetIds: any) => {

    if (searchText) {
      return allIds.filter(item => item.indexOf(chain) === 0).map(id => byId[id])
        .filter(item => (item.symbol && item.symbol.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) || (item.name && item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) || (item.contract && item.contract.toLowerCase().indexOf(searchText.toLowerCase()) !== -1))
    } else {
      if (chain === 'ETHEREUM') {
        // check legal id for contain chain ～>ETHEREUM
        const legalIds = allIds.filter((item: any) => item.indexOf(chain) === 0)
        const proiorityIds = legalIds.filter((id: string) => byId[id].display_priority > 0) || []
        const selectIds = legalIds.filter((id: string) => (selectedAssetIds || []).indexOf(id) >= 0) || []
        // union
        // @ts-ignore
        const sortSymbol = l => l.sort( (t1, t2) => {
          const unicode = (t:string) => t && t.length ? t.charCodeAt(0):0
          return unicode(t1.symbol) - unicode(t2.symbol)
        })
        const unionProiorityTokens = sortSymbol((proiorityIds || []).filter((id:string) => {
           return selectIds.indexOf(id) === -1
        }).map((id:string) => byId[id])) || []
        const selectTokens = sortSymbol(selectIds.map((id: string) => byId[id])) || []
        const unionTokens = [...selectTokens,...unionProiorityTokens];
        return  unionTokens
        // const unionTokens = Array.from(new Set([...selectIds, ...proiorityIds])).map((id: string) => byId[id])

        // tslint:disable-next-line:only-arrow-functions
        // return unionTokens.sort( (t1, t2) => {
        //   const unicode = (t:string) => t && t.length ? t.charCodeAt(0):0
        //   return unicode(t1.symbol) - unicode(t2.symbol)
        // })

        // const newSelectAssetIds = (selectedAssetIds || []).filter(selectAssetId => selectAssetId !== )
        //   console.log('new:',newSelectAssetIds);
        // return allIds.filter(item => item.indexOf(chain) === 0).map(id => byId[id]).filter(item => item.display_priority > 0)
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
      return {chain: 'BITCOIN', symbol: 'BTC', precision: 8}
    } else if (activeAssetId === 'ETHEREUM/ETH') {
      return {chain: 'ETHEREUM', symbol: 'ETH', precision: 8}
    } else if (activeAssetId === 'EOS/EOS') {
      return {chain: 'EOS', symbol: 'EOS', precision: 4}
    } else if (activeAssetId === 'CHAINX/PCX') {
      return {chain: 'CHAINX', symbol: 'PCX', precision: 8}
    } else if (activeAssetId === chain.polkadot + '/RFUEL') {
      return {chain: chain.polkadot, symbol: 'RFUEL', precision: 12}
    }
     else if (byId) {
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
      return {chain: 'BITCOIN', symbol: 'BTC', precision: 8}
    } else if (transferAssetId === 'ETHEREUM/ETH') {
      return {chain: 'ETHEREUM', symbol: 'ETH', precision: 8}
    } else if (transferAssetId === 'EOS/EOS') {
      return {chain: 'EOS', symbol: 'EOS', precision: 4}
    } else if (transferAssetId === 'CHAINX/PCX') {
      return {chain: 'CHAINX', symbol: 'PCX', precision: 8}
    } else if (transferAssetId === chain.polkadot + '/RFUEL') {
      return {chain: chain.polkadot, symbol: 'RFUEL', precision: 12, decimals: 12,contract: 0}
    }
     else if (byId) {
      return byId[transferAssetId]
    }

    return null
  }
)

export const withdrawAssetSelector = createSelector(
  activeAssetIdSelector,
  assetByIdSelector,
  (activeAssetId: any, byId: any) => {

    if (activeAssetId === chain.polkadot + '/RFUEL') {
      return {chain: chain.polkadot, symbol: 'RFUEL', precision: 12, decimals: 12,contract: 0}
    }
    else if (byId) {
      return byId[activeAssetId]
    }

    return null
  }
)


export const eosAssetAllIdsSelector = createSelector(
  assetAllIdsSelector,
  (assetAllIds: string) => assetAllIds.filter(item => item.indexOf('EOS/') === 0)
)

export const activeWalletSelectedAssetsSelector = createSelector(
  selectedAssetIdsSelector,
  assetByIdSelector,
  (selectedAssetIds: any, byId: any,) => {
    if (selectedAssetIds && selectedAssetIds.length) {
      return selectedAssetIds.map(id => byId[id])
    }

    return null
  }
)
