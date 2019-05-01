import { handleActions } from 'utils/redux'
import * as actions from 'actions/asset'

const initialState = {
  ETHEREUM: {
    byId: {},
    allIds: [],
    selected: {}
  },
  EOS: {
    byId: {},
    allIds: [],
    selected: {}
  }
}

export default handleActions({
  [actions.updateEOSAsset] (state, action) {
    state.EOS.byId = state.EOS.byId || {}
    state.EOS.allIds = state.EOS.allIds || []

    action.payload.forEach(asset => {
      state.EOS.byId[asset.id] = asset
      const index = state.EOS.allIds.findIndex((v: any) => v === asset.id)
      if (index === -1) state.EOS.allIds.push(asset.id)
    })
  },
  [actions.updateETHAsset] (state, action) {
    state.ETHEREUM.byId = state.ETHEREUM.byId || {}
    state.ETHEREUM.allIds = state.ETHEREUM.allIds || []

    action.payload.forEach(asset => {
      state.ETHEREUM.byId[asset.id] = asset
      const index = state.ETHEREUM.allIds.findIndex((v: any) => v === asset.id)
      if (index === -1) state.ETHEREUM.allIds.push(asset.id)
    })
  }
}, initialState)
