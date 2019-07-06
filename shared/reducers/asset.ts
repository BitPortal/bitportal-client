import { handleActions } from 'utils/redux'
import * as actions from 'actions/asset'

export const initialState = {
  byId: {},
  allIds: [],
  selected: {},
  activeAssetId: null,
  transferAssetId: null,
  searchText: ''
}

export default handleActions({
  [actions.setActiveAsset] (state, action) {
    state.activeAssetId = action.payload
    state.transferAssetId = action.payload
  },
  [actions.setTransferAsset] (state, action) {
    state.transferAssetId = action.payload
  },
  [actions.updateAsset] (state, action) {
    state.byId = state.byId || {}
    state.allIds = state.allIds || []

    const chain = action.payload.chain
    action.payload.assets.forEach(asset => {
      const contract = asset.contract || asset.account || asset.address
      const id = `${chain}/${contract}/${asset.symbol}`
      state.byId[id] = asset
      state.byId[id].contract = contract
      state.byId[id].chain = chain
      const index = state.allIds.findIndex((v: any) => v === id)
      if (index === -1) state.allIds.push(id)
    })
  },
  [actions.addAsset] (state, action) {
    state.byId = state.byId || {}
    state.allIds = state.allIds || []

    const chain = action.payload.chain
    const asset = action.payload.asset
    const contract = asset.contract || asset.account || asset.address
    const id = `${chain}/${contract}/${asset.symbol}`
    state.byId[id] = asset
    state.byId[id].contract = contract
    state.byId[id].chain = chain
    const index = state.allIds.findIndex((v: any) => v === id)
    if (index === -1) state.allIds.push(id)
  },
  [actions.selectAsset] (state, action) {
    state.selected = state.selected || {}
    const walletId = action.payload.walletId
    const assetId = action.payload.assetId

    if (!state.selected[walletId]) {
      state.selected[walletId] = [assetId]
    } else if (state.selected[walletId].indexOf(assetId) === -1) {
      state.selected[walletId].unshift(assetId)
    }
  },
  [actions.selectAssetList] (state, action) {
    state.selected = state.selected || {}
    const assets = action.payload

    assets.forEach(asset => {
      const walletId = asset.walletId
      const assetId = asset.assetId

      if (!state.selected[walletId]) {
        state.selected[walletId] = [assetId]
      } else if (state.selected[walletId].indexOf(assetId) === -1) {
        state.selected[walletId].push(assetId)
      }
    })
  },
  [actions.unselectAsset] (state, action) {
    const walletId = action.payload.walletId
    const assetId = action.payload.assetId

    if (state.selected && state.selected[walletId] && state.selected[walletId].indexOf(assetId) !== -1) {
      const index = state.selected[walletId].findIndex(id => id === assetId)
      state.selected[walletId].splice(index, 1)
    }
  },
  [actions.setAssetSearchText] (state, action) {
    state.searchText = action.payload
  }
}, initialState)
