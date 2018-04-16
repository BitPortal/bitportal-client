import { handleActions } from 'redux-actions'
import Immutable from 'immutable'
import * as actions from 'actions/drawer'

const initialState = Immutable.fromJS({
  selectedMarket: 'OKex'
})

export default handleActions({
  [actions.selectMarket] (state, action) {
    return state.set('selectedMarket', action.payload)
  }
}, initialState)
