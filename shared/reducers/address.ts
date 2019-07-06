import { handleActions } from 'utils/redux'
import * as actions from 'actions/address'

export const initialState = {
  byId: {},
  allIds: [],
  child: {
    byId: {},
    allIds: []
  }
}

export default handleActions({
  [actions.updateAddress] (state, action) {
    const { id, addresses } = action.payload
    state.byId[id] = addresses

    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1) state.allIds.push(id)
  },
  [actions.removeAddress] (state, action) {
    const { id, chain, address } = action.payload
    delete state.byId[`${chain}/${address}`]

    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1) state.allIds.splice(id, 1)
  },
  [actions.updateChildAddress] (state, action) {
    const { id, address } = action.payload
    if (!state.child) state.child = { byId: {}, allIds: [] }
    state.child.byId[id] = address

    const index = state.child.allIds.findIndex((v: any) => v === id)
    if (index === -1) state.child.allIds.push(id)
  }
}, initialState)
