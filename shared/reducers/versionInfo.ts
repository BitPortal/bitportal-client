import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/versionInfo'

const initialState = Immutable.fromJS({
  data: {},
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.getVersionInfoRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getVersionInfoSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false).set('data', action.payload)
  },
  [actions.getVersionInfoFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  }
}, initialState)
