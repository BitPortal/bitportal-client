import { createSelector } from 'reselect'
import { Map } from 'immutable' 

const producersSelector = (state: RootState) => state.vote
const selectedProducersSelector = (state: RootState) => state.vote.get('selectedProducers')

export const voteProcuderSelector = createSelector(
  producersSelector,
  selectedProducersSelector,
  (producers: any, selectedProducers: any) => producers.update(
    'data',
    (producerList: any) => {
      const newProducers = producerList.map((item: any, index: number) => {
        const arrIndex = selectedProducers.findIndex((selectedProducer: any) => item.get('name') == selectedProducer.get('name'))
        if (arrIndex == -1) return item.merge(Map({ id: index, hasVoted: false }))
        else return item.merge(Map({ id: index, hasVoted: true }))
      })
      // console.log('### --18', newProducers.toJS())
      return newProducers
    }
  )
)
