import { createSelector } from 'reselect'
import Immutable from 'immutable'

export const getInitialEOSAsset = (presetSelectedAsset?: any) => Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  selectedAsset: presetSelectedAsset || [],
  searchResult: []
})

export const eosAssetSelector = (state: RootState) => state.eosAsset.get('data')

export const selectedEOSAssetSelector = (state: RootState) => state.eosAsset.get('selectedAsset')
export const searchEOSAssetResultSelector = (state: RootState) => state.eosAsset.get('searchResult')

export const selectedEOSAssetContractSelector = createSelector(
  selectedEOSAssetSelector,
  (selectedEOSAsset: any) => selectedEOSAsset.map((v: any) => v.get('contract'))
)

export const eosAssetListSelector = createSelector(
  eosAssetSelector,
  selectedEOSAssetSelector,
  (asset: any, selected: any) => asset.map((v: any) =>  {
    const index = selected.findIndex((i: any) => v.get('account') === i.get('contract') && v.get('symbol') === i.get('symbol'))
    return v.set('selected', index !== -1)
  })
)

export const eosAssetSearchResultListSelector = createSelector(
  searchEOSAssetResultSelector,
  selectedEOSAssetSelector,
  (asset: any, selected: any) => asset.map((v: any) =>  {
    const index = selected.findIndex((i: any) => v.get('account') === i.get('contract') && v.get('symbol') === i.get('symbol'))
    return v.set('selected', index !== -1)
  })
)
