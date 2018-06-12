import Immutable from 'immutable'
import { handleActions } from 'redux-actions'
import * as actions from 'actions/currency'

const initialState = Immutable.fromJS({
  rate: 1, // USD:USD / USD:CNY
  symbol: 'USD',
  loading: false,
  loaded: false,
  error: null
})

export default handleActions({
  [actions.getCurrencyRateRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getCurrencyRateSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false).set('rate', action.payload)
  },
  [actions.getCurrencyRateFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.setCurrency] (state, action) {
    return state.set('symbol', action.payload.symbol).set('rate', action.payload.rate)
  }
}, initialState)
