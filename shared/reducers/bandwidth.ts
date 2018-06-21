import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/bandwidth'

const initialState = Immutable.fromJS({
  delegating: false,
  undelegating: false,
  error: null
})

export default handleActions({
  [actions.delegateBandwidthRequested] (state) {
    return state.set('delegating', true)
  },
  [actions.delegateBandwidthSucceeded] (state) {
    return state.set('delegating', false)
  },
  [actions.delegateBandwidthFailed] (state, action) {
    return state.set('error', action.payload).set('delegating', false)
  },
  [actions.undelegateBandwidthRequested] (state) {
    return state.set('undelegating', true)
  },
  [actions.undelegateBandwidthSucceeded] (state) {
    return state.set('undelegating', false)
  },
  [actions.undelegateBandwidthFailed] (state, action) {
    return state.set('error', action.payload).set('undelegating', false)
  },
  [actions.clearError] (state) {
    return state.set('error', null)
  }
}, initialState)
