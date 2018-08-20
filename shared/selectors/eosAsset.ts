import { createSelector } from 'reselect'

const dataSelector = (state: RootState) => state.eosAsset.get('data')
const assetPrefsSelector = (state: RootState) => state.eosAsset.get('assetPrefs')

export const eosAssetListSelector = createSelector(
  dataSelector,
  assetPrefsSelector,
  (data: any, assets: any) => data.map((item: any) => {
    const found = assets.findIndex(
      (element: any) => element.get('symbol') === item.get('symbol')
    )
    return item.set('value', found !== -1 ? assets.get(found).get('value') : false)
  })
)
