import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/version'

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
  },
  [actions.setVersionInfo] (state, action) {
    return state.update('data', (v: any) => v.set('localVersion', action.payload))
  }
}, initialState)
