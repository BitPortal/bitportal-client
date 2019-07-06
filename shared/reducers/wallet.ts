import { handleActions } from 'utils/redux'
import * as actions from 'actions/wallet'

export const initialState = {
  identityWallets: {
    byId: {},
    allIds: []
  },
  importedWallets: {
    byId: {},
    allIds: []
  },
  activeWalletId: null,
  managingWalletId: null,
  transferWalletId: null,
  activeChain: null
}

export default handleActions({
  [actions.setActiveChain] (state, action) {
    state.activeChain = action.payload
  },
  [actions.setActiveWallet] (state, action) {
    state.activeWalletId = action.payload
    state.managingWalletId = action.payload
    state.transferWalletId = action.payload
  },
  [actions.setManagingWallet] (state, action) {
    state.managingWalletId = action.payload
  },
  [actions.setTransferWallet] (state, action) {
    state.transferWalletId = action.payload
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
  [actions.updateEOSWalletAddress] (state, action) {
    const id = action.payload.id
    const address = action.payload.address
    state.identityWallets.byId[id].address = address
  },
  [actions.updateBTCWalletAddressType] (state, action) {
    const id = action.payload.id
    const address = action.payload.address
    const segWit = action.payload.segWit

    if (state.identityWallets.byId[id]) {
      state.identityWallets.byId[id].address = address
      state.identityWallets.byId[id].segWit = segWit
    }

    if (state.importedWallets.byId[id]) {
      state.importedWallets.byId[id].address = address
      state.importedWallets.byId[id].segWit = segWit
    }
  },
  [actions.updateWalletName] (state, action) {
    const id = action.payload.id
    const name = action.payload.name

    if (state.identityWallets.byId[id]) {
      state.identityWallets.byId[id].name = name
    } else if (state.importedWallets.byId[id]) {
      state.importedWallets.byId[id].name = name
    }
  },
  [actions.updateEOSWalletAccounts] (state, action) {
    const id = action.payload.id
    const accounts = action.payload.accounts
    state.identityWallets.byId[id].accounts = accounts
  },
  [actions.resetWallet] () {
    return initialState
  }
}, initialState)
