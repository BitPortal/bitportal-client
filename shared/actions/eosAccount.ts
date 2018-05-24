import { createAction } from 'redux-actions'

export const createAccountRequested = createAction<CreateAccountParams>('eosAccount/CREATE_ACCOUNT_REQUESTED')
export const createAccountSucceeded = createAction<CreateAccountResult>('eosAccount/CREATE_ACCOUNT_SUCCEEDED')
export const createAccountFailed = createAction<ErrorMessage>('eosAccount/CREATE_ACCOUNT_FAILED')

export const createEOSAccountRequested = createAction<CreateEOSAccountParams>('eosAccount/CREATE_EOS_ACCOUNT_REQUESTED')
export const createEOSAccountSucceeded = createAction<CreateEOSAccountResult>('eosAccount/CREATE_EOS_ACCOUNT_SUCCEEDED')
export const createEOSAccountFailed = createAction<ErrorMessage>('eosAccount/CREATE_EOS_ACCOUNT_FAILED')

export const getEOSAccountRequested = createAction<GetEOSAccountParams>('eosAccount/GET_EOS_ACCOUNT_REQUESTED')
export const getEOSAccountSucceeded = createAction<GetEOSAccountResult>('eosAccount/GET_EOS_ACCOUNT_SUCCEEDED')
export const getEOSAccountFailed = createAction<ErrorMessage>('eosAccount/GET_EOS_ACCOUNT_FAILED')

export const authEOSAccountRequested = createAction<AuthEOSAccountParams>('eosAccount/AUTH_EOS_ACCOUNT_REQUESTED')
export const authEOSAccountSucceeded = createAction<AuthEOSAccountResult>('eosAccount/AUTH_EOS_ACCOUNT_SUCCEEDED')
export const authEOSAccountFailed = createAction<ErrorMessage>('eosAccount/AUTH_EOS_ACCOUNT_FAILED')

export const importEOSAccountRequested = createAction<ImportEOSAccountParams>('eosAccount/IMPORT_EOS_ACCOUNT_REQUESTED')
export const importEOSAccountSucceeded = createAction<ImportEOSAccountResult>('eosAccount/IMPORT_EOS_ACCOUNT_SUCCEEDED')
export const importEOSAccountFailed = createAction<ErrorMessage>('eosAccount/IMPORT_EOS_ACCOUNT_FAILED')

export const switchEOSAccount = createAction<SwitchEOSAccountParams>('eosAccount/SWITCH_EOS_ACCOUNT')

export const setEOSAccountPassword = createAction<SetEOSAccountPasswordParams>('eosAccount/SET_EOS_ACCOUNT_PASSWORD')

export const syncEOSAccount = createAction('eosAccount/SYNC_EOS_ACCOUNT')
export const syncEOSAccountSucceeded = createAction<SyncEOSAccountResult>('eosAccount/SYNC_EOS_ACCOUNT_SUCCEEDED')

export const clearAccount = createAction('eosAccount/CLEAR_ACCOUNT')
