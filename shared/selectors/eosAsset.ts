import { createSelector } from 'reselect'

const dataSelector = (state: RootState) => state.ticker.get('data')
const assetPrefsSelector = (state: RootState) => state.ticker.get('assetPrefs')

export const eosAssetListSelector = createSelector(
  dataSelector,
  assetPrefsSelector,
  (data: any, assets: any) => {}
)
