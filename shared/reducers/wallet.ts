import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/wallet'

const initialState = Immutable.fromJS({
  data: {},
  hdWalletList: [],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.createWalletRequested] (state) {
    return state.set('loading', true)
  },
  [actions.createWalletSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
  },
  [actions.createWalletFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.syncWalletRequested] (state) {
    return state.set('loading', true)
  },
  [actions.syncWalletSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('hdWalletList', Immutable.fromJS(action.payload.hdWalletList))
      .set('data', Immutable.fromJS(action.payload.active))
  },
  [actions.syncWalletFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.switchWalletSucceeded] (state, action) {
    return state.set('data', Immutable.fromJS(action.payload))
  }
}, initialState)
