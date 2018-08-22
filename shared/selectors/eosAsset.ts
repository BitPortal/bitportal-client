import { createSelector } from 'reselect'
import Immutable from 'immutable'
import _ from 'lodash'

const dataSelector = (state: RootState) => state.eosAsset.get('data')
const assetPrefsSelector = (state: RootState) => state.eosAsset.get('assetPrefs')
const searchValueSelector = (state: RootState) => state.eosAsset.get('searchValue')

export const eosAssetListSelector = createSelector(
  dataSelector,
  assetPrefsSelector,
  (data: any, assets: any) => data.map((item: any) => {
    const found = assets.findIndex((element: any) => element.get('symbol') === item.get('symbol'))
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
    let list =  _.remove(assetList.toJS(), (item: any) => {
      return item.symbol.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) !== -1
    })
    if (searchValue) return Immutable.fromJS(list)
    else return Immutable.fromJS([])
  }
)
