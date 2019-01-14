import { handleActions } from 'utils/redux'
import * as actions from 'actions/ticker'

const initialState = {
  byId: {},
  allIds: []
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
  }
}, initialState)
