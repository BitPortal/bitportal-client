import { handleActions } from 'utils/redux'
import * as actions from 'actions/fee'

export const initialState = {
  BITCOIN: {},
  ETHEREUM: {
    gasLimit: 60000
  }
}

export default handleActions({
  [actions.updateBTCFees] (state, action) {
    state.BITCOIN = action.payload
  },
  [actions.updateETHGasPrice] (state, action) {
    state.ETHEREUM.gasPrice = action.payload
    state.ETHEREUM.gasLimit = state.ETHEREUM.gasLimit || 60000
  }
}, initialState)
