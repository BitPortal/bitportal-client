import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as actions from 'actions/drawer'

const initialState = Immutable.fromJS({
  selectedMarket: 'OKex',
  selectedCoin: 'BTC'
})

export default handleActions({
  [actions.selectMarket] (state, action) {
    return state.set('selectedMarket', action.payload)
  },
  [actions.selectCoin] (state, action) {
    return state.set('selectedCoin', action.payload)
  }
}, initialState)
