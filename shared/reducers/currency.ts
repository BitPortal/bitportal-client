import { handleActions } from 'redux-actions'
import * as actions from 'actions/currency'
import { getInitialCurrency } from 'selectors/currency'

export default handleActions({
  [actions.getCurrencyRateRequested] (state) {
    return state.set('loading', true)
  },
  [actions.getCurrencyRateSucceeded] (state, action) {
    return state.set('loaded', true).set('loading', false)
    .set('rate', action.payload.rate).set('symbol', action.payload.symbol)
  },
  [actions.getCurrencyRateFailed] (state, action) {
    return state.set('error', action.payload).set('loading', false)
  },
  [actions.setCurrency] (state, action) {
    return state.set('symbol', action.payload)
  },
  [actions.setRate] (state, action) {
    return state.set('rate', action.payload)
  }
}, getInitialCurrency())
