import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/wallet'

const initialState = Immutable.fromJS({
  data: [],
  active: {},
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
      .set('active', Immutable.fromJS(action.payload))
      .update('data', (v: any) => v.push(Immutable.fromJS(action.payload)))
  },
  [actions.createWalletFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.syncWalletRequested] (state) {
    return state.set('loading', true)
  },
  [actions.syncWalletSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('active', Immutable.fromJS(action.payload.active))
      .set('data', Immutable.fromJS(action.payload.wallets))
  },
  [actions.syncWalletFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.switchWalletSucceeded] (state, action) {
    return state.set('active', Immutable.fromJS(action.payload))
  }
}, initialState)
