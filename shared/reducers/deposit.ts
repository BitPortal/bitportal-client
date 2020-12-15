import { handleActions } from 'utils/redux'
import * as actions from 'actions/deposit'

export const initialState = {
  byId: {},
  allIds: [],
}

export default handleActions({
  [actions.updateBitcoinDepositAddress] (state, action) {
    const id = action.payload.id
    const address = action.payload.address

    if (!state.byId[id]) {
      state.byId[id] = {}
    }
    state.byId[id].btcDepositAddress = address
  },
  [actions.updateDepositAddress] (state, action) {
    const id = action.payload.id
    const address = action.payload.address
    const symbol = action.payload.symbol
    if (!state.byId[id]) {
      state.byId[id] = {}
      state.allIds.push(id)
    }
    state.byId[id].depositAddress = state.byId[id].depositAddress || {}
    state.byId[id].depositAddress[symbol] = address
  },
  [actions.updateIdOnChain] (state, action) {
    const id = action.payload.id
    const idOnChain = action.payload.idOnChain

    if (!state.byId[id]) {
      state.byId[id] = {}
      state.allIds.push(id)
    }
    state.byId[id].idOnChain = idOnChain
  },
}, initialState)
