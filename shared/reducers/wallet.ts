import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/wallet'

const initialState = Immutable.fromJS({
  data: {},
  hdWalletList: [],
  classicWalletList: [],
  loggingOut: false,
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.createWalletRequested] (state) {
    return state.set('loading', true)
  },
  [actions.createWalletAndEOSAccountRequested] (state) {
    return state.set('loading', true)
  },
  [actions.createHDWalletSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
      .update('hdWalletList', (v: any) => v.push(Immutable.fromJS(action.payload)))
  },
  [actions.createClassicWalletSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
      .update('classicWalletList', (v: any) => v.push(Immutable.fromJS(action.payload)))
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
      .set('classicWalletList', Immutable.fromJS(action.payload.classicWalletList))
      .set('data', Immutable.fromJS(action.payload.active))
  },
  [actions.syncWalletFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.switchWalletSucceeded] (state, action) {
    return state.set('data', Immutable.fromJS(action.payload))
  },
  [actions.logoutRequested] (state) {
    return state.set('loggingOut', true)
  },
  [actions.logoutSucceeded] (state) {
    return state.set('loggingOut', false)
  },
  [actions.logoutFailed] (state, action) {
    return state.set('loggingOut', false).set('error', action.payload)
  },
  [actions.resetWallet] () {
    return initialState
  }
}, initialState)
