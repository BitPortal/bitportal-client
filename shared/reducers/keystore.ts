import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/keystore'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.generateEOSKeyRequested] (state) {
    return state.set('loading', true)
  },
  [actions.generateEOSKeySucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .update('data', (v: any) => v.insert(Immutable.fromJS(action.payload)))
  },
  [actions.generateEOSKeyFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.importEOSKeyRequested] (state) {
    return state.set('loading', true)
  },
  [actions.importEOSKeySucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .update('data', (v: any) => v.push(Immutable.fromJS(action.payload)))
  },
  [actions.importEOSKeyFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.syncKeyRequested] (state) {
    return state.set('loading', true)
  },
  [actions.syncKeySucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
  },
  [actions.syncKeyFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  }
}, initialState)