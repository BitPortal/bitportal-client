import { createAction } from 'redux-actions'

export const generateEOSKeyRequested = createAction('keystore/CREATE_EOS_KEY_REQUESTED')
export const generateEOSKeySucceeded = createAction<string>('keystore/CREATE_EOS_KEY_SUCCEEDED')
export const generateEOSKeyFailed = createAction<ErrorMessage>('keystore/CREATE_EOS_KEY_FAILED')

export const importEOSKeyRequested = createAction<ImportEOSKeyParams>('keystore/IMPORT_EOS_KEY_REQUESTED')
export const importEOSKeySucceeded = createAction<ImportKeyResult>('keystore/IMPORT_EOS_KEY_SUCCEEDED')
export const importEOSKeyFailed = createAction<ErrorMessage>('keystore/IMPORT_EOS_KEY_FAILED')

export const syncKeyRequested = createAction('keystore/SYNC_KEY_REQUESTED')
export const syncKeySucceeded = createAction<ImportKeyResult[]>('keystore/SYNC_KEY_SUCCEEDED')
export const syncKeyFailed = createAction<ErrorMessage>('keystore/SYNC_KEY_FAILED')