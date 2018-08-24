import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/balance'

const initialState = Immutable.fromJS({
  tokenBalance: {},
  eosBalance: {},
  loading: false,
  loaded: false,
  error: null,
  activeAsset: null
})

export default handleActions({
  [actions.getEOSBalanceRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getEOSBalanceSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .update('eosBalance', (v: any) => v.set(action.payload.eosAccountName, Immutable.fromJS(action.payload.balanceInfo)))
  },
  [actions.getEOSBalanceFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.getEOSAssetBalanceRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getEOSAssetBalanceSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .update('tokenBalance', (v: any) => {
        const eosAccountName = action.payload.eosAccountName
        const balanceInfo = action.payload.balanceInfo
        if (v.has(eosAccountName)) {
          return v.update(eosAccountName, (v: any) => {
            const index = v.findIndex((v: any) => v.get('contract') === balanceInfo.contract)
            return index === -1 ? v.push(Immutable.fromJS(balanceInfo)) : v.set(index, Immutable.fromJS(balanceInfo))
          })
        } else {
          return v.set(eosAccountName, Immutable.fromJS([balanceInfo]))
        }
      })
  },
  [actions.getEOSAssetBalanceFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.getEOSAssetBalanceListRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getEOSAssetBalanceListSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .update('tokenBalance', (v: any) => v.set(action.payload.eosAccountName, Immutable.fromJS(action.payload.balanceInfo)))
  },
  [actions.getEOSAssetBalanceListFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.setActiveAsset] (state, action) {
    return state.set('activeAsset', action.payload)
  },
  [actions.resetBalance] () {
    return initialState
  }
}, initialState)
