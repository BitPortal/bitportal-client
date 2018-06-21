import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/ram'

const initialState = Immutable.fromJS({
  buying: false,
  selling: false,
  error: null
})

export default handleActions({
  [actions.buyRAMRequested] (state) {
    return state.set('buying', true)
  },
  [actions.buyRAMSucceeded] (state) {
    return state.set('buying', false)
  },
  [actions.buyRAMFailed] (state, action) {
    return state.set('error', action.payload).set('buying', false)
  },
  [actions.sellRAMRequested] (state) {
    return state.set('selling', true)
  },
  [actions.sellRAMSucceeded] (state) {
    return state.set('selling', false)
  },
  [actions.sellRAMFailed] (state, action) {
    return state.set('error', action.payload).set('selling', false)
  },
  [actions.clearError] (state) {
    return state.set('error', null)
  }
}, initialState)
