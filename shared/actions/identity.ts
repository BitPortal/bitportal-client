import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const addIdentity = createAction('identity/ADD')
export const mergeIdentity = createAction('identity/MERGE')
export const removeIdentity = createAction('identity/REMOVE')

export const validateMnemonics = createAsyncAction('identity/VALIDATE_MNEMONICS')
export const scanIdentity = createAsyncAction('identity/SCAN')
export const createIdentity = createAsyncAction('identity/CREATE')
export const recoverIdentity = createAsyncAction('identity/RECOVER')
export const backupIdentity = createAsyncAction('identity/BACKUP')
export const deleteIdentity = createAsyncAction('identity/DELETE')
