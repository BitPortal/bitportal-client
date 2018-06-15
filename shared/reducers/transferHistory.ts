import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/transferHistory'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.getTransferHistoryRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getTransferHistorySucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
  },
  [actions.getTransferHistoryFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  }
}, initialState)
