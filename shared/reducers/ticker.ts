import { handleActions } from 'utils/redux'
import * as actions from 'actions/ticker'

const initialState = {
  byId: {},
  allIds: [],
  resources: {
    byId: {},
    allIds: []
  }
}

export default handleActions({
  [actions.updateTicker] (state, action) {
    const allIds = []
    action.payload.forEach(ticker => {
      const id = `${ticker.name.toUpperCase()}/${ticker.symbol}`
      state.byId[id] = ticker
      allIds.push(id)
    })

    state.allIds = allIds
  },
  [actions.updateEOSRAMTicker] (state, action) {
    const { id } = action.payload
    state.resources = state.resources || {
      byId: {},
      allIds: []
    }

    state.resources.byId[id] = action.payload
    const index = state.resources.allIds.findIndex(item => item === id)

    if (index === -1) {
      state.resources.allIds.push(id)
    }
  }
}, initialState)
