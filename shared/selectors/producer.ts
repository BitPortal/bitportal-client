import { createSelector } from 'reselect'

export const producerRowsSelector = (state: RootState) => state.producer.getIn(['data', 'rows'])
export const selectedListSelector = (state: RootState) => state.producer.get('selected')

export const producerListSelector = createSelector(
  producerRowsSelector,
  selectedListSelector,
  (producer: any, selected: any) => producer.map((v: any) =>  v.set('selected', selected.includes(v.get('owner'))))
)
