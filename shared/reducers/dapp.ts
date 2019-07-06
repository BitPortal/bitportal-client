import { handleActions } from 'utils/redux'
import * as actions from 'actions/dapp'

export const initialState = {
  byId: {},
  allIds: [],
  recommend: {
    byId: {},
    allIds: []
  },
  bookmarked: {
    allIds: []
  },
  categoryFilter: null
}

export default handleActions({
  [actions.updateDapp] (state, action) {
    action.payload.forEach(dapp => {
      state.byId[dapp.id] = dapp

      const index = state.allIds.findIndex((v: any) => v === dapp.id)

      if (index === -1) {
        state.allIds.push(dapp.id)
      }
    })
  },
  [actions.updateDappRecommend] (state, action) {
    action.payload.forEach(recommend => {
      state.recommend.byId[recommend.id] = recommend

      const index = state.recommend.allIds.findIndex((v: any) => v === recommend.id)

      if (index === -1) {
        state.recommend.allIds.push(recommend.id)
      }
    })
  },
  [actions.bookmarkDapp] (state, action) {
    if (!state.bookmarked) state.bookmarked = {
      allIds: []
    }

    const index = state.bookmarked.allIds.findIndex((v: any) => v === action.payload.id)

    if (index === -1) {
      state.bookmarked.allIds.push(action.payload.id)
    }
  },
  [actions.unBookmarkDapp] (state, action) {
    const index = state.bookmarked.allIds.findIndex((v: any) => v === action.payload.id)

    if (index !== -1) {
      state.bookmarked.allIds.splice(index, 1)
    }
  },
  [actions.setDappFilter] (state, action) {
    state.categoryFilter = action.payload
  },
  [actions.clearDappFilter] (state) {
    state.categoryFilter = null
  }
}, initialState)
