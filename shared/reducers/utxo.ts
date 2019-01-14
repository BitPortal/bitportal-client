import { handleActions } from 'utils/redux'
import * as actions from 'actions/utxo'

const initialState = {
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updateUTXO] (state, action) {
    const { id, utxo } = action.payload
    state.byId[id] = utxo
    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1) state.allIds.push(id)
  }
}, initialState)
