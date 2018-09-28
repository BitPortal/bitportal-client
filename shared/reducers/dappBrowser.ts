import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/dappBrowser'
import { escapeJSONString } from 'utils'

const initialState = Immutable.fromJS({
  pendingMessage: null,
  hasPendingMessage: false,
  resolving: false,
  sendingMessage: null
})

export default handleActions({
  [actions.pendMessage] (state, action) {
    return state.set('pendingMessage', Immutable.fromJS(action.payload))
      .set('hasPendingMessage', true)
  },
  [actions.resolveMessage] (state) {
    return state.set('resolving', true)
  },
  [actions.resolveMessageFinished] (state) {
    return state.set('resolving', false)
  },
  [actions.sendMessage] (state, action) {
    return state.set('sendingMessage', escapeJSONString(JSON.stringify(action.payload)))
  },
  [actions.clearMessage] () {
    return initialState
  }
}, initialState)
