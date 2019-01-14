import { handleActions } from 'utils/redux'
import * as actions from 'actions/transaction'

const initialState = {
  activeTransactionId: null,
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updateTransactions] (state, action) {
    const { id, items, pagination } = action.payload

    if (!state.byId[id]) {
      state.byId[id] = { id, pagination }

      state.byId[id].items = {
        byId: {},
        allIds: []
      }
    }

    items.forEach((item: any) => {
      state.byId[id].items.byId[item.id] = item
      const index = state.byId[id].items.allIds.findIndex((v: any) => v && v.id === item.id)
      if (index === -1) state.byId[id].items.allIds.unshift({ id: item.id, timestamp: item.timestamp })
    })
    state.byId[id].items.allIds.sort((a: any, b: any) => b.timestamp - a.timestamp)

    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1)  state.allIds.push(id)
  },
  [actions.addTransaction] (state, action) {
    const { id, item } = action.payload

    if (!state.byId[id]) {
      state.byId[id] = { id }

      state.byId[id].items = {
        byId: {},
        allIds: []
      }
    }

    state.byId[id].items.byId[item.id] = item
    const itemIndex = state.byId[id].items.allIds.findIndex((v: any) => v && v.id === item.id)
    if (itemIndex === -1) {
      let insertIndex = 0
      for (let i = 0; i < state.byId[id].items.allIds.length; i++) {
        if (item.timestamp > state.byId[id].items.allIds[i].timestamp) {
          insertIndex = i
          break
        }
      }
      state.byId[id].items.allIds.splice(insertIndex, 0, { id: item.id, timestamp: item.timestamp })
    }

    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1)  state.allIds.push(id)
  },
  [actions.updateTransaction] (state, action) {
    const { id, item } = action.payload
    if (!state.byId[id]) return state
    state.byId[id].items.byId[item.id] = item
  },
  [actions.removeTransactions] (state, action) {
    const { id } = action.payload
    state.allIds.splice(state.allIds.findIndex((item: any) => item === id), 1)
    delete state.byId[id]
  },
  [actions.setActiveTransactionId] (state, action) {
    state.activeTransactionId = action.payload
  }
}, initialState)
