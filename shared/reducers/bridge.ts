import { handleActions } from 'utils/redux'
import * as actions from 'actions/bridge'
import { escapeJSONString } from 'utils'

const initialState = {
  pendingMessage: null,
  hasPendingMessage: false,
  loadingContract: false,
  resolving: false,
  messageToSend: null,
  error: null,
  host: null
}

export default handleActions({
  [actions.pendMessage] (state, action) {
    state.pendingMessage = action.payload
    state.hasPendingMessage = true
    state.loadingContract = false
  },
  [actions.resolveMessage] (state) {
    state.resolving = true
  },
  [actions.resolveMessageFinished] (state) {
    state.resolving = false
  },
  [actions.resolveMessageFailed] (state, action) {
    state.resolving = false
    state.error = action.payload
  },
  [actions.loadContract] (state) {
    state.loadingContract = true
  },
  [actions.sendMessage] (state, action) {
    state.messageToSend = escapeJSONString(JSON.stringify(action.payload))
    state.loadingContract = false
  },
  [actions.clearPasswordError] (state) {
    state.error = null
  },
  [actions.setHost] (state, action) {
    state.host = action.payload
  },
  [actions.clearMessage] (state) {
    state.pendingMessage = null
    state.hasPendingMessage = false
    state.loadingContract = false
    state.resolving = false
    state.messageToSend = null
    state.error = null
  }
}, initialState)
