import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/transfer'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null,
  showModal: false
})

export default handleActions({
  [actions.transferRequested] (state) {
    return state.set('loading', true)
  },
  [actions.transferSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
  },
  [actions.transferFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.clearTransferError] (state) {
    return state.set('error', null)
  },
  [actions.openTransferModal] (state) {
    return state.set('showModal', true)
  },
  [actions.closeTransferModal] (state) {
    return state.set('showModal', false)
  }
}, initialState)
