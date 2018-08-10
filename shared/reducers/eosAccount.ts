import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/eosAccount'

const initialState = Immutable.fromJS({
  data: {},
  isAssetHidden: false,
  backupCompleted: true,
  eosAccountList: [],
  eosAccountCreationInfo: {},
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.createEOSAccountRequested] (state) {
    return state.set('loading', true)
  },
  [actions.createEOSAccountSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
      .update('eosAccountList', (v: any) => v.push(Immutable.fromJS(action.payload)))
  },
  [actions.createEOSAccountFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.importEOSAccountRequested] (state) {
    return state.set('loading', true)
  },
  [actions.importEOSAccountSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .set('data', Immutable.fromJS(action.payload))
      .update('eosAccountList', (v: any) => v.push(Immutable.fromJS(action.payload)))
  },
  [actions.getEOSAccountSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .update('eosAccountList', (v: any) => {
        const index = v.findIndex((item: any) => item.get('account_name') === action.payload.account_name)
        if (index === -1) {
          return v.push(Immutable.fromJS(action.payload))
        }

        return v.update(index, () => Immutable.fromJS(action.payload))
      })
  },
  [actions.importEOSAccountFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.getEOSKeyAccountsRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getEOSKeyAccountsSucceeded] (state) {
    return state.set('loaded', true).set('loading', false)
  },
  [actions.getEOSKeyAccountsFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.syncEOSAccount] (state, action) {
    return state.set('eosAccountList', Immutable.fromJS(action.payload))
  },
  [actions.syncEOSAccountCreationInfo] (state, action) {
    return state.set('eosAccountCreationInfo', Immutable.fromJS(action.payload))
  },
  [actions.clearEOSAccountError] (state) {
    return state.set('error', null)
  },
  [actions.resetEOSAccount] () {
    return initialState
  },
  [actions.hiddenAssetDisplay] (state, action) {
    return state.set('isAssetHidden', action.payload)
  },
  [actions.completeBackup] (state) {
    return state.setIn(['eosAccountCreationInfo', 'backup'], true)
  },
}, initialState)
