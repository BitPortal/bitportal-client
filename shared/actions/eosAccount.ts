import { createAction } from 'redux-actions'

export const createEOSAccountRequested = createAction<CreateEOSAccountParams>('eosAccount/CREATE_REQUESTED')
export const createEOSAccountSucceeded = createAction<CreateEOSAccountResult>('eosAccount/CREATE_SUCCEEDED')
export const createEOSAccountFailed = createAction<ErrorMessage>('eosAccount/CREATE_FAILED')
export const syncEOSAccount = createAction<SyncEOSAccountResult>('eosAccount/SYNC')
export const importEOSAccountRequested = createAction<ImportEOSAccountParams>('eosAccount/IMPORT_EOS_ACCOUNT_REQUESTED')
export const importEOSAccountSucceeded = createAction<ImportEOSAccountResult>('eosAccount/IMPORT_EOS_ACCOUNT_SUCCEEDED')
export const importEOSAccountFailed = createAction<ErrorMessage>('eosAccount/IMPORT_EOS_ACCOUNT_FAILED')
export const resetEOSAccount = createAction('eosAccount/RESET')
export const clearEOSAccountError = createAction('eosAccount/CLEAR_ERROR')
export const getEOSAccountRequested = createAction<GetEOSAccountParams>('eosAccount/GET_REQUESTED')
export const getEOSAccountSucceeded = createAction<GetEOSAccountResult>('eosAccount/GET_SUCCEEDED')
export const getEOSAccountFailed = createAction<ErrorMessage>('eosAccount/GET_FAILED')
export const validateEOSAccountRequested = createAction<ValidateEOSAccountParams>('eosAccount/VALIDATE_REQUESTED')
export const validateEOSAccountSucceeded = createAction<ValidateEOSAccountResult>('eosAccount/VALIDATE_SUCCEEDED')
export const validateEOSAccountFailed = createAction<ValidateEOSAccountRejection>('eosAccount/VALIDATE_FAILED')
export const hiddenAssetDisplay = createAction<string>('eosAccount/HIDDEN_ASSET_DISPLAY')
export const getEOSKeyAccountsRequested = createAction<GetEOSKeyAccountsParams>('eosAccount/GET_KEY_ACCOUNTS_REQUESTED')
export const getEOSKeyAccountsSucceeded = createAction<GetEOSKeyAccountsResult>('eosAccount/GET_KEY_ACCOUNTS_SUCCEEDED')
export const getEOSKeyAccountsFailed = createAction<ErrorMessage>('eosAccount/GET_KEY_ACCOUNTS_FAILED')
