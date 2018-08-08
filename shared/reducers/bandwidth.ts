import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/bandwidth'

const initialState = Immutable.fromJS({
  delegating: false,
  undelegating: false,
  error: null,
  showSuccess: false,
  activeForm: 'Delegate'
})

export default handleActions({
  [actions.delegateBandwidthRequested] (state) {
    return state.set('delegating', true)
  },
  [actions.delegateBandwidthSucceeded] (state) {
    return state.set('delegating', false).set('showSuccess', true)
  },
  [actions.delegateBandwidthFailed] (state, action) {
    return state.set('error', action.payload).set('delegating', false)
  },
  [actions.undelegateBandwidthRequested] (state) {
    return state.set('undelegating', true)
  },
  [actions.undelegateBandwidthSucceeded] (state) {
    return state.set('undelegating', false).set('showSuccess', true)
  },
  [actions.undelegateBandwidthFailed] (state, action) {
    return state.set('error', action.payload).set('undelegating', false)
  },
  [actions.setActiveForm] (state, action) {
    return state.set('activeForm', action.payload)
  },
  [actions.clearBandwidthError] (state) {
    return state.set('error', null).set('delegating', false).set('undelegating', false)
  },
  [actions.hideSuccessModal] (state) {
    return state.set('showSuccess', false)
  }
}, initialState)
