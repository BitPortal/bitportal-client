import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/ram'

const initialState = Immutable.fromJS({
  data: {},
  loading: false,
  buying: false,
  selling: false,
  error: null,
  showSuccess: false
})

export default handleActions({
  [actions.buyRAMRequested] (state) {
    return state.set('buying', true)
  },
  [actions.buyRAMSucceeded] (state) {
    return state.set('buying', false).set('showSuccess', true)
  },
  [actions.buyRAMFailed] (state, action) {
    return state.set('error', action.payload).set('buying', false)
  },
  [actions.sellRAMRequested] (state) {
    return state.set('selling', true)
  },
  [actions.sellRAMSucceeded] (state) {
    return state.set('selling', false).set('showSuccess', true)
  },
  [actions.sellRAMFailed] (state, action) {
    return state.set('error', action.payload).set('selling', false)
  },
  [actions.getRAMMarketRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getRAMMarketSucceeded] (state, action) {
    return state.set('loading', false).set('data', Immutable.fromJS(action.payload))
  },
  [actions.getRAMMarketFailed] (state) {
    return state.set('loading', false) // .set('error', action.payload)
  },
  [actions.clearRAMError] (state) {
    return state.set('error', null).set('selling', false).set('buying', false)
  },
  [actions.hideSuccessModal] (state) {
    return state.set('showSuccess', false)
  }
}, initialState)
