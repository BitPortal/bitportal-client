import { handleActions } from 'utils/redux'
import * as actions from 'actions/wallet'

const initialState = {
  identityWallets: {
    byId: {},
    allIds: []
  },
  importedWallets: {
    byId: {},
    allIds: []
  },
  activeWalletId: null
}

export default handleActions({
  [actions.setActiveWallet] (state, action) {
    state.activeWalletId = action.payload
  },
  [actions.addIdentityWallets] (state, action) {
    action.payload.forEach(wallet => {
      state.identityWallets.byId[wallet.id] = wallet
      state.identityWallets.allIds.push(wallet.id)
    })
  },
  [actions.mergeIdentityWallets] (state, action) {
    action.payload.forEach(wallet => {
      state.identityWallets.byId[wallet.id] = wallet

      const index = state.identityWallets.allIds.findIndex((v: any) => v === wallet.id)

      if (index === -1) {
        state.identityWallets.allIds.push(wallet.id)
      }
    })
  },
  [actions.addImportedWallet] (state, action) {
    const wallet = action.payload
    state.importedWallets.byId[wallet.id] = wallet
    state.importedWallets.allIds.push(wallet.id)
  },
  [actions.addImportedWallets] (state, action) {
    action.payload.forEach(wallet => {
      state.importedWallets.byId[wallet.id] = wallet
      state.importedWallets.allIds.push(wallet.id)
    })
  },
  [actions.mergeImportedWallets] (state, action) {
    // state.importedWallets.allIds = []

    action.payload.forEach(wallet => {
      state.importedWallets.byId[wallet.id] = wallet

      const index = state.importedWallets.allIds.findIndex((v: any) => v === wallet.id)

      if (index === -1) {
        state.importedWallets.allIds.push(wallet.id)
      }
    })
  },
  [actions.removeImportedWallet] (state, action) {
    const id = action.payload
    state.importedWallets.allIds.splice(state.importedWallets.allIds.findIndex((v: any) => v === id), 1)
    delete state.importedWallets.byId[id]
  },
  [actions.removeIdentityWallet] (state, action) {
    const id = action.payload
    state.identityWallets.allIds.splice(state.identityWallets.allIds.findIndex((v: any) => v === id), 1)
    delete state.identityWallets.byId[id]
  },
  [actions.resetWallet] () {
    return initialState
  }
}, initialState)
