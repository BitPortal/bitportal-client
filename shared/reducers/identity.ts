import { handleActions } from 'utils/redux'
import * as actions from 'actions/identity'

export const initialState = {}

export default handleActions({
  [actions.addIdentity] (state, action) {
    return action.payload
  },
  [actions.mergeIdentity] (state, action) {
    return { ...state, ...action.payload }
  },
  [actions.removeIdentity] (state) {
    return initialState
  }
}, initialState)
