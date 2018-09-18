import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/dappBrowser'

const initialState = Immutable.fromJS({
  pendingMessage: null,
  hasPendingMessage: false,
  resolving: false
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
  // [actions.rejectMessage] (state) {
  //   return state.set('resolving', false)
  // },
  [actions.clearMessage] (state) {
    return state.set('pendingMessage', null)
      .set('hasPendingMessage', false)
      .set('resolving', false)
  },
  [actions.closeDappBrowser] () {
    return initialState
  }
}, initialState)
