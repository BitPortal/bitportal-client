import { createSelector } from 'reselect'
import { initialState } from 'reducers/producer'

export const producerByIdSelector = (state: RootState) => state.producer.byId || initialState.byId
export const producerSearchTextSelector = (state: RootState) => state.producer.searchText || initialState.searchText
export const producerAllIdsSelector = (state: RootState) => state.producer.allIds || initialState.allIds
export const producerSelectedIdsSelector = (state: RootState) => state.producer.selectedIds || initialState.selectedIds

export const producerSelector = createSelector(
  producerByIdSelector,
  producerAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
)

export const producerWithSearchSelector = createSelector(
  producerByIdSelector,
  producerAllIdsSelector,
  producerSearchTextSelector,
  (byId: any, allIds: any, searchText: string) => {
    if (searchText) {
      return allIds.map(id => byId[id]).filter(item => item.owner.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    } else {
      return allIds.map(id => byId[id])
    }
  }
)

export const producerSearchSelector = createSelector(
  producerByIdSelector,
  producerAllIdsSelector,
  producerSearchTextSelector,
  (byId: any, allIds: any, searchText: string) => {
    if (searchText) {
      return allIds.map(id => byId[id]).filter(item => item.owner.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    } else {
      return []
    }
  }
)

export const producerIdsSelector = createSelector(
  producerSelector,
  (producers: any) => producers.map(item => item.owner)
)

export const selectedProducerSelector = createSelector(
  producerByIdSelector,
  producerSelectedIdsSelector,
  (byId: any, selectedIds: any) => selectedIds ? selectedIds.map(id => byId[id]) : []
)
