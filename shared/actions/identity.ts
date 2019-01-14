import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const addIdentity = createAction<AddIdentityParams>('identity/ADD')
export const mergeIdentity = createAction<AddIdentityParams>('identity/MERGE')
export const removeIdentity = createAction<RemoveIdentityParams>('identity/REMOVE')

export const validateMnemonics = createAsyncAction('identity/VALIDATE_MNEMONICS')
export const scanIdentity = createAsyncAction('identity/SCAN')
export const createIdentity = createAsyncAction('identity/CREATE')
export const recoverIdentity = createAsyncAction('identity/RECOVER')
export const backupIdentity = createAsyncAction('identity/BACKUP')
export const deleteIdentity = createAsyncAction('identity/DELETE')
