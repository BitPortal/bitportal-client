import { createSelector } from 'reselect'

export const producerByIdSelector = (state: RootState) => state.producer.byId
export const producerSearchTextSelector = (state: RootState) => state.producer.searchText
export const producerAllIdsSelector = (state: RootState) => state.producer.allIds
export const producerSelectedIdsSelector = (state: RootState) => state.producer.selectedIds || []

export const producerSelector = createSelector(
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

export const producerIdsSelector = createSelector(
  producerSelector,
  (producers: any) => producers.map(item => item.owner)
)

export const selectedProducerSelector = createSelector(
  producerByIdSelector,
  producerSelectedIdsSelector,
  (byId: any, selectedIds: any) => selectedIds ? selectedIds.map(id => byId[id]) : []
)
