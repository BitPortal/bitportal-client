import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/dappBrowser'
import { escapeJSONString } from 'utils'

const initialState = Immutable.fromJS({
  pendingMessage: null,
  hasPendingMessage: false,
  loadingContract: false,
  resolving: false,
  sendingMessage: null,
  error: null
})

export default handleActions({
  [actions.pendMessage] (state, action) {
    return state.set('pendingMessage', Immutable.fromJS(action.payload))
      .set('hasPendingMessage', true)
      .set('loadingContract', false)
  },
  [actions.resolveMessage] (state) {
    return state.set('resolving', true)
  },
  [actions.resolveMessageFinished] (state) {
    return state.set('resolving', false)
  },
  [actions.resolveMessageFailed] (state, action) {
    return state.set('resolving', false).set('error', action.payload)
  },
  [actions.loadContract] (state) {
    return state.set('loadingContract', true)
  },
  [actions.sendMessage] (state, action) {
    return state.set('sendingMessage', escapeJSONString(JSON.stringify(action.payload))).set('loadingContract', false)
  },
  [actions.clearPasswordError] (state) {
    return state.set('error', null)
  },
  [actions.clearMessage] () {
    return initialState
  }
}, initialState)
