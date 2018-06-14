import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/stake'

const initialState = Immutable.fromJS({
  data: {},
  loading: false,
  loaded: false,
  error: null,
  unstaking: false,
  unstaked: false,
  unstakeError: null
})

export default handleActions({
  [actions.stakeRequested] (state) {
    return state.set('loading', true)
  },
  [actions.stakeSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
  },
  [actions.stakeFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.unstakeRequested] (state) {
    return state.set('unstaking', true)
  },
  [actions.unstakeSucceeded] (state, action) {
    return state.set('unstaked', true).set('unstaking', false)
  },
  [actions.unstakeFailed] (state, action) {
    return state.set('unstakeError', action.payload).set('unstaking', false)
  },
  [actions.clearError] (state, action) {
    return state.set('unstakeError', null).set('error', null)
  }
}, initialState)
