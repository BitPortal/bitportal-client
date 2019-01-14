import { handleActions } from 'utils/redux'
import * as actions from 'actions/address'

const initialState = {
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updateAddress] (state, action) {
    const { id, addresses } = action.payload
    state.byId[id] = addresses

    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1) state.allIds.push(id)
  }
}, initialState)
