import { handleActions } from 'utils/redux'
import * as actions from 'actions/currency'

const initialState = {
  symbol: 'CNY'
}

export default handleActions({
  [actions.setCurrency] (state, action) {
    state.symbol = action.payload
  }
}, initialState)
