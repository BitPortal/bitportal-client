import { createSelector } from 'reselect'

export const getInitialEOSAsset = (presetSelectedAsset?: any) => ({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  toggledAsset: presetSelectedAsset || [],
  searchResult: []
})

export const eosAssetSelector = (state: RootState) => state.eosAsset.get('data')
export const toggledEOSAssetSelector = (state: RootState) => state.eosAsset.get('toggledAsset')
export const searchEOSAssetResultSelector = (state: RootState) => state.eosAsset.get('searchResult')

export const selectedEOSAssetSelector = createSelector(
  toggledEOSAssetSelector,
  (toggledEOSAsset: any) => toggledEOSAsset.filter((v: any) => v.get('selected'))
)

export const selectedEOSAssetContractSelector = createSelector(
  selectedEOSAssetSelector,
  (selectedEOSAsset: any) => selectedEOSAsset.map((v: any) => v.get('contract'))
)

export const eosAssetListSelector = createSelector(
  eosAssetSelector,
  selectedEOSAssetSelector,
  toggledEOSAssetSelector,
  (asset: any, selected: any, toggled: any) => {
    const assetWithSelection = asset.map((v: any) =>  {
      const index = selected.findIndex((i: any) => v.get('account') === i.get('contract') && v.get('symbol') === i.get('symbol'))
      return v.set('selected', index !== -1)
    })

    const toggledNoDefaultAsset = toggled.filter((v: any) => {
      const index = assetWithSelection.findIndex((i: any) => i.get('account') === v.get('contract') && v.get('symbol') === i.get('symbol'))
      return index === -1
    }).map((v: any) => v.set('account', v.get('contract')))

    return assetWithSelection.concat(toggledNoDefaultAsset)
  }
)

export const eosAssetSearchResultListSelector = createSelector(
  searchEOSAssetResultSelector,
  selectedEOSAssetSelector,
  (asset: any, selected: any) => asset.map((v: any) =>  {
    const index = selected.findIndex((i: any) => v.get('account') === i.get('contract') && v.get('symbol') === i.get('symbol'))
    return v.set('selected', index !== -1)
  })
)
