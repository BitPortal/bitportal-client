import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/wallet'

const initialState = Immutable.fromJS({
  account: {},
  accounts: [],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.createEOSAccountRequested] (state) {
    return state.set('loading', true)
  },
  [actions.createEOSAccountSucceeded] (state) {
    return state.set('loaded', true).set('loading', false)
  },
  [actions.createEOSAccountFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.switchEOSAccount] (state, action) {
    return state.set('account', Immutable.fromJS({ account_name: action.payload }))
  }
}, initialState)
