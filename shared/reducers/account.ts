import { handleActions } from 'utils/redux'
import * as actions from 'actions/account'

const initialState = {
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updateAccount] (state, action) {
    const account = action.payload
    state.byId = state.byId || {}
    state.allIds = state.allIds || []
    state.byId[account.id] = account
    const index = state.allIds.findIndex((v: any) => v === account.id)
    if (index === -1) state.allIds.push(account.id)
  },
  [actions.removeAccount] (state, action) {
    const id = action.payload
    const index = state.allIds.findIndex((v: any) => v === id)
    state.allIds.splice(index, 1)
    delete state.byId[id]
  }
}, initialState)
