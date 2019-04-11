import { createSelector } from 'reselect'

export const producerByIdSelector = (state: RootState) => state.producer.byId
export const producerAllIdsSelector = (state: RootState) => state.producer.allIds
export const producerSelectedIdsSelector = (state: RootState) => state.producer.selectedIds || []

export const producerSelector = createSelector(
  producerByIdSelector,
  producerAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
)

export const selectedProducerSelector = createSelector(
  producerByIdSelector,
  producerSelectedIdsSelector,
  (byId: any, selectedIds: any) => selectedIds ? selectedIds.map(id => byId[id]) : []
)
