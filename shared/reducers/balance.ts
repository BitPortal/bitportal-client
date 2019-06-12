import { handleActions } from 'utils/redux'
import * as actions from 'actions/balance'

const initialState = {
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updateBalance] (state, action) {
    const balance = action.payload
    state.byId[balance.id] = state.byId[balance.id] || {}

    if (!balance.contract) {
      state.byId[balance.id].syscoin = balance
    } else {
      state.byId[balance.id][`${balance.contract}/${balance.symbol}`] = balance
    }

    const index = state.allIds.findIndex((v: any) => v === balance.id)
    if (index === -1) state.allIds.push(balance.id)
  },
  [actions.updateBalanceList] (state, action) {
    const id = action.payload.id
    const chain = action.payload.chain
    const balanceList = action.payload.balanceList

    state.byId[id] = state.byId[id] || {}

    balanceList.forEach(balance => {
      if (!balance.contract) {
        state.byId[id].syscoin = { ...balance, chain, id }
      } else {
        state.byId[id][`${balance.contract}/${balance.symbol}`] = { ...balance, chain, id }
      }
    })

    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1) state.allIds.push(id)
  },
  [actions.resetBalance] () {
    return initialState
  }
}, initialState)
