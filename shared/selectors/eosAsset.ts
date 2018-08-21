import { createSelector } from 'reselect'
import Immutable from 'immutable'

const dataSelector = (state: RootState) => state.eosAsset.get('data')
const assetPrefsSelector = (state: RootState) => state.eosAsset.get('assetPrefs')
const searchValueSelector = (state: RootState) => state.eosAsset.get('searchValue')

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

export const eosAssetSearchListSelector = createSelector(
  dataSelector,
  assetPrefsSelector,
  searchValueSelector,
  (data: any, assets: any, searchValue: any) => {
    let assetList = data.map((item: any) => {
      const found = assets.findIndex((element: any) => element.get('symbol') === item.get('symbol'))
      return item.set('value', found !== -1 ? assets.get(found).get('value') : false)
    })
    let eosAssetSearchList = Immutable.fromJS([])
    assetList.map((item: any) => {
      if (item.get('symbol').indexOf(searchValue) !== -1) {
        eosAssetSearchList.push(item)
        console.log('###', eosAssetSearchList.toJS(), searchValue, item.get('symbol'))
      }
    })
    return eosAssetSearchList
  }
)
