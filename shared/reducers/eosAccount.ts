import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/eosAccount'

const initialState = Immutable.fromJS({
  data: {},
  eosAccountList: [],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.createEOSAccountRequested] (state) {
    return state.set('loading', true)
  },
  [actions.createEOSAccountSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
      .update('eosAccountList', (v: any) => v.push(Immutable.fromJS(action.payload)))
  },
  [actions.createEOSAccountFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.importEOSAccountRequested] (state) {
    return state.set('loading', true)
  },
  [actions.importEOSAccountSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
      .update('eosAccountList', (v: any) => v.push(Immutable.fromJS(action.payload)))
  },
  [actions.importEOSAccountFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.syncEOSAccount] (state, action) {
    return state.set('eosAccountList', Immutable.fromJS(action.payload))
  },
  [actions.resetEOSAccount] () {
    return initialState
  }
}, initialState)
