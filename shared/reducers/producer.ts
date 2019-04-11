import { handleActions } from 'utils/redux'
import * as actions from 'actions/producer'

const initialState = {
  byId: {},
  allIds: [],
  selectedIds: [],
  sortType: 'default',
  total_producer_vote_weight: 0,
  more: null
}

export default handleActions({
  [actions.updateProducer] (state, action) {
    const { producers, more, total_producer_vote_weight } = action.payload

    state.allIds = []

    producers.forEach(producer => {
      if (state.selectedIds.indexOf(producer.owner) !== -1) producer.selected = true

      state.byId[producer.owner] = producer

      const index = state.allIds.findIndex((v: any) => v === producer.owner)

      if (index === -1) {
        state.allIds.push(producer.owner)
      }
    })

    state.total_producer_vote_weight = total_producer_vote_weight
    state.more = more
  },
  [actions.toggleSelect] (state, action) {
    state.selectedIds = state.selectedIds || []
    const id = action.payload
    const index = state.selectedIds.findIndex((v: any) => v === id)

    if (index !== -1) {
      state.selectedIds.splice(index, 1)
      state.byId[id].selected = false
    } else {
      state.selectedIds.push(id)
      state.byId[id].selected = true
    }
  },
  [actions.setSelected] (state, action) {
    const oldSelected = state.selectedIds
    oldSelected.forEach(id => {
      state.byId[id].selected = false
    })

    state.selectedIds = action.payload || []

    state.selectedIds.forEach(id => {
      state.byId[id].selected = true
    })
  },
  [actions.clearProducer] () {
    return initialState
  }
}, initialState)
