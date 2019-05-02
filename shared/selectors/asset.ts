import { createSelector } from 'reselect'

const eosAssetByIdSelector = (state: RootState) => state.asset.EOS.byId
const eosAssetAllIdsSelector = (state: RootState) => state.asset.EOS.allIds

const ethAssetByIdSelector = (state: RootState) => state.asset.ETHEREUM.byId
const ethAssetAllIdsSelector = (state: RootState) => state.asset.ETHEREUM.allIds

export const eosAssetSelector = createSelector(
  eosAssetByIdSelector,
  eosAssetAllIdsSelector,
  (byId: any, allIds: any) => (allIds && byId) && allIds.map(id => byId[id]).filter(item => item.display_priority > 0)
)

export const ethAssetSelector = createSelector(
  ethAssetByIdSelector,
  ethAssetAllIdsSelector,
  (byId: any, allIds: any) => (allIds && byId) && allIds.map(id => byId[id]).filter(item => item.display_priority > 0)
)
