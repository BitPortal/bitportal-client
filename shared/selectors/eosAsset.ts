import { createSelector } from 'reselect'
import Immutable from 'immutable'

export const getInitialEOSAsset = (presetSelectedAsset?: any) => Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  searchValue: '',
  selectedAsset: presetSelectedAsset || []
})

export const eosAssetSelector = (state: RootState) => state.eosAsset.get('data')

export const selectedEOSAssetSelector = (state: RootState) => state.eosAsset.get('selectedAsset')

export const eosAssetListSelector = createSelector(
  eosAssetSelector,
  selectedEOSAssetSelector,
  (asset: any, selected: any) => asset.map((v: any) =>  v.set('selected', selected.includes(v.get('account'))))
)
