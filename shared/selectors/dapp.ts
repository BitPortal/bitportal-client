import { createSelector } from 'reselect'

const dappByIdSelector = (state: RootState) => state.dapp.byId
const dappAllIdsSelector = (state: RootState) => state.dapp.allIds
const categoryFilterSelector = (state: RootState) => state.dapp.categoryFilter

const dappRecommendByIdSelector = (state: RootState) => state.dapp.recommend.byId
const dappRecommendAllIdsSelector = (state: RootState) => state.dapp.recommend.allIds

export const dappBookmarkAllIdsSelector = (state: RootState) => state.dapp.bookmarked && state.dapp.bookmarked.allIds

export const dappSelector = createSelector(
  dappByIdSelector,
  dappAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
)

export const dappBookmarkSelector = createSelector(
  dappByIdSelector,
  dappBookmarkAllIdsSelector,
  (byId: any, allIds: any) => allIds && allIds.map(id => byId[id]).filter((dapp: any) => !!dapp)
)

export const categoryDappSelector = createSelector(
  dappSelector,
  categoryFilterSelector,
  dappBookmarkSelector,
  (dapps: any, categoryFilter: any, bookmarked: any) => {
    if (categoryFilter) {
      if (categoryFilter === 'new') {
        return dapps.filter((dapp: any) => !!dapp.is_new)
      } else if (categoryFilter === 'hot') {
        return dapps.filter((dapp: any) => !!dapp.is_hot)
      } else if (categoryFilter === 'bookmarked') {
        return bookmarked
      }

      return dapps.filter((dapp: any) => dapp.category === categoryFilter)
    }

    return null
  }
)

export const dappRecommendSelector = createSelector(
  dappRecommendByIdSelector,
  dappRecommendAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
)

export const newDappSelector = createSelector(
  dappSelector,
  (dapps: any) => dapps.filter((dapp: any) => !!dapp.is_new)
)

export const hotDappSelector = createSelector(
  dappSelector,
  (dapps: any) => dapps.filter((dapp: any) => !!dapp.is_hot)
)

export const gameDappSelector = createSelector(
  dappSelector,
  (dapps: any) => dapps.filter((dapp: any) => dapp.category === 'game')
)

export const toolDappSelector = createSelector(
  dappSelector,
  (dapps: any) => dapps.filter((dapp: any) => dapp.category === 'tool')
)
