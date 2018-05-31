import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/balance'

const initialState = Immutable.fromJS({
  data: [],
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.getBalanceRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getBalanceSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
      .update('data', (v: any) => {
        const name = action.payload.name
        const balances = action.payload.balances
        const index = v.findIndex((item: any) => item.get('eosAccountName') === name)

        if (index === -1) {
          return v.push(Immutable.fromJS({
            eosAccountName: name,
            eosAccountBalance: balances
          }))
        } else {
          return v.update(index, (v: any) => v.set('eosAccountBalance', Immutable.fromJS(balances)))
        }
      })
  },
  [actions.getBalanceFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.resetBalance] () {
    return initialState
  }
}, initialState)
