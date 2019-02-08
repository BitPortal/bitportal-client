import { handleActions } from 'utils/redux'
import * as actions from 'actions/dapp'

const initialState = {
  byId: {},
  allIds: [],
  recommend: {
    byId: {},
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
  [actions.setDappFilter] (state, action) {
    state.categoryFilter = action.payload
  },
  [actions.clearDappFilter] (state) {
    state.categoryFilter = null
  }
}, initialState)
