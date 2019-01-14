import { handleActions } from 'utils/redux'
import * as actions from 'actions/balance'

const initialState = {
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updateBalance] (state, action) {
    const balance = action.payload
    state.byId[balance.id] = balance
    const index = state.allIds.findIndex((v: any) => v === balance.id)
    if (index === -1) state.allIds.push(balance.id)
  },
  [actions.resetBalance] () {
    return initialState
  }
}, initialState)
