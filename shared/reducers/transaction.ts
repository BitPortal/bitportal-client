import { handleActions } from 'utils/redux'
import * as actions from 'actions/transaction'

export const initialState = {
  activeTransactionId: null,
  transferTransactionId: null,
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updateTransactions] (state, action) {
    const { id, items, pagination, canLoadMore, assetId, loadingMore } = action.payload
    state.byId[id] = state.byId[id] || {}

    if (!state.byId[id][assetId]) {
      state.byId[id][assetId] = { id, pagination, canLoadMore, loadingMore }

      state.byId[id][assetId].items = {
        byId: {},
        allIds: []
      }
    } else {
      state.byId[id][assetId].pagination = pagination
      state.byId[id][assetId].canLoadMore = canLoadMore
      state.byId[id][assetId].loadingMore = loadingMore
    }

    items.forEach((item: any) => {
      state.byId[id][assetId].items.byId[item.id] = item
      const index = state.byId[id][assetId].items.allIds.findIndex((v: any) => v && v.id === item.id)
      if (index === -1) state.byId[id][assetId].items.allIds.unshift({ id: item.id, timestamp: item.timestamp })
    })
    state.byId[id][assetId].items.allIds.sort((a: any, b: any) => b.timestamp - a.timestamp)

    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1)  state.allIds.push(id)
  },
  [actions.addTransactions] (state, action) {
    const { id, items, pagination, canLoadMore, assetId, loadingMore } = action.payload
    state.byId[id] = state.byId[id] || {}
    state.byId[id][assetId] = state.byId[id][assetId] || {}
    state.byId[id][assetId].items = {
      byId: {},
      allIds: []
    }

    state.byId[id][assetId].pagination = pagination
    state.byId[id][assetId].canLoadMore = canLoadMore
    state.byId[id][assetId].loadingMore = loadingMore

    items.forEach((item: any) => {
      state.byId[id][assetId].items.byId[item.id] = item
      const index = state.byId[id][assetId].items.allIds.findIndex((v: any) => v && v.id === item.id)
      if (index === -1) state.byId[id][assetId].items.allIds.unshift({ id: item.id, timestamp: item.timestamp })
    })
    state.byId[id][assetId].items.allIds.sort((a: any, b: any) => b.timestamp - a.timestamp)

    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1)  state.allIds.push(id)
  },
  [actions.setLoadingMore] (state, action) {
    const { id, assetId, loadingMore } = action.payload
    state.byId[id] = state.byId[id] || {}

    if (!state.byId[id][assetId]) {
      state.byId[id][assetId] = { id, loadingMore }
    } else {
      state.byId[id][assetId].loadingMore = loadingMore
    }

    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1)  state.allIds.push(id)
  },
  [actions.addTransaction] (state, action) {
    const { id, item, assetId } = action.payload
    state.byId[id] = state.byId[id] || {}

    if (!state.byId[id][assetId]) {
      state.byId[id][assetId] = { id }

      state.byId[id][assetId].items = {
        byId: { [item.id]: item },
        allIds: [{ id: item.id, timestamp: item.timestamp }]
      }
    } else {
      const itemIndex = state.byId[id][assetId].items.allIds.findIndex((v: any) => v && v.id === item.id)
      if (itemIndex === -1) {
        let insertIndex = 0
        for (let i = 0; i < state.byId[id][assetId].items.allIds.length; i++) {
          if (item.timestamp > state.byId[id][assetId].items.allIds[i].timestamp) {
            insertIndex = i
            break
          }
        }
        state.byId[id][assetId].items.allIds.splice(insertIndex, 0, { id: item.id, timestamp: item.timestamp })
        state.byId[id][assetId].items.byId[item.id] = item
      } else {
        state.byId[id][assetId].items.byId[item.id] = item
      }
    }

    state.byId[id][assetId].items.allIds.sort((a: any, b: any) => b.timestamp - a.timestamp)

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
    state.transferTransactionId = action.payload
  }
}, initialState)
