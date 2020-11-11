import { handleActions } from 'utils/redux'
import * as actions from 'actions/asset'

export const initialState = {
  byId: {},
  allIds: [],
  selected: {},
  display: {},
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
      state.selected[walletId] = [{assetId,select:true}]
    } else {
      const index = (state.selected[walletId]||[]).findIndex((id:any) => id.assetId === assetId)
      if (index !== -1) {
        state.selected[walletId][index].select = true
      }else {
        state.selected[walletId].unshift({assetId,select:true})
      }
    }
  },
  [actions.selectAssetList] (state, action) {
    state.selected = state.selected || {}
    const assets = action.payload

    assets.forEach(asset => {
      const walletId = asset.walletId
      const assetId = asset.assetId

      if (!state.selected[walletId]) {
        state.selected[walletId] = [{assetId,select:true}]
      }else {
        const obj = (state.selected[walletId]||[]).find((id:any) => id.assetId === assetId) || []
        if (!obj || obj.length <= 0 ) {
          state.selected[walletId].push({assetId,select:true})
        }
      }
    })
  },
  [actions.unselectAsset] (state, action) {
    const walletId = action.payload.walletId
    const assetId = action.payload.assetId

    if (state.selected && state.selected[walletId]) {
      const index = (state.selected[walletId]||[]).findIndex((id:any) => id.assetId === assetId)
      if (index !== -1) {
        state.selected[walletId][index].select = false
      }
    }
  },
  [actions.setAssetSearchText] (state, action) {
    state.searchText = action.payload
  }
}, initialState)
