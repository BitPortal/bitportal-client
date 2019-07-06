import produce from 'immer'
import { handleActions } from 'utils/redux'
import * as actions from 'actions/blockchain'

export const initialState = {
  data: {

  },
  events: {
    scan: {
      loading: false,
      loaded: false,
      error: null
    },
    create: {
      loading: false,
      loaded: false,
      error: null
    },
    recover: {
      loading: false,
      loaded: false,
      error: null
    },
    backup: {
      loading: false,
      loaded: false,
      error: null
    },
    delete: {
      loading: false,
      loaded: false,
      error: null
    },
    validateMnemonics: {
      loading: false,
      loaded: false,
      error: null
    }
  }
}

export default handleActions({
  [actions.addIdentity] (state, action) {
    state.data = action.payload
  },
  [actions.removeIdentity] (state) {
    state.data = {}
  },
  [actions.scanIdentityRequested] (state) {
    state.events.scan.loading = true
  },
  [actions.scanIdentitySucceeded] (state) {
    state.events.scan.loading = false
    state.events.scan.loaded = true
  },
  [actions.scanIdentityFailed] (state, action) {
    state.events.scan.loading = false
    state.events.scan.error = action.payload
  },
  [actions.createIdentityRequested] (state) {
    state.events.create.loading = true
  },
  [actions.createIdentitySucceeded] (state) {
    state.events.create.loading = false
    state.events.create.loaded = true
  },
  [actions.createIdentityFailed] (state, action) {
    state.events.create.loading = false
    state.events.create.error = action.payload
  },
  [actions.validateMnemonicsRequested] (state) {
    state.events.validateMnemonics.loading = true
  },
  [actions.validateMnemonicsSucceeded] (state) {
    state.events.validateMnemonics.loading = false
    state.events.validateMnemonics.loaded = true
  },
  [actions.validateMnemonicsFailed] (state, action) {
    state.events.validateMnemonics.loading = false
    state.events.validateMnemonics.error = action.payload
  },
  [actions.recoverIdentityRequested] (state) {
    state.events.recover.loading = true
  },
  [actions.recoverIdentitySucceeded] (state) {
    state.events.recover.loading = false
    state.events.recover.loaded = true
  },
  [actions.recoverIdentityFailed] (state, action) {
    state.events.recover.loading = false
    state.events.recover.error = action.payload
  },
  [actions.clearRecoverIdentityError] (state) {
    state.events.recover.error = null
  },
  [actions.deleteIdentityRequested] (state) {
    state.events.delete.loading = true
  },
  [actions.deleteIdentitySucceeded] (state) {
    state.events.delete.loading = false
    state.events.delete.loaded = true
  },
  [actions.deleteIdentityFailed] (state, action) {
    state.events.delete.loading = false
    state.events.delete.error = action.payload
  },
  [actions.clearDeleteIdentityError] (state) {
    state.events.delete.error = null
  },
  [actions.backupIdentityRequested] (state) {
    state.events.backup.loading = true
  },
  [actions.backupIdentitySucceeded] (state) {
    state.events.backup.loading = false
    state.events.backup.loaded = true
  },
  [actions.backupIdentityFailed] (state, action) {
    state.events.backup.loading = false
    state.events.backup.error = action.payload
  },
  [actions.clearBackupIdentityError] (state) {
    state.events.backup.error = null
  }
}, initialState)
