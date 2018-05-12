import { createAction } from 'redux-actions'

export const createEOSAccountRequested = createAction<CreateEOSAccountParams>('wallet/CREATE_EOS_ACCOUNT_REQUESTED')
export const createEOSAccountSucceeded = createAction<CreateEOSAccountResult>('wallet/CREATE_EOS_ACCOUNT_SUCCEEDED')
export const createEOSAccountFailed = createAction<ErrorMessage>('wallet/CREATE_EOS_ACCOUNT_FAILED')

export const getEOSAccountRequested = createAction<GetEOSAccountParams>('wallet/GET_EOS_ACCOUNT_REQUESTED')
export const getEOSAccountSucceeded = createAction<GetEOSAccountResult>('wallet/GET_EOS_ACCOUNT_SUCCEEDED')
export const getEOSAccountFailed = createAction<ErrorMessage>('wallet/GET_EOS_ACCOUNT_FAILED')

export const authEOSAccountRequested = createAction<AuthEOSAccountParams>('wallet/AUTH_EOS_ACCOUNT_REQUESTED')
export const authEOSAccountSucceeded = createAction<AuthEOSAccountResult>('wallet/AUTH_EOS_ACCOUNT_SUCCEEDED')
export const authEOSAccountFailed = createAction<ErrorMessage>('wallet/AUTH_EOS_ACCOUNT_FAILED')

export const switchEOSAccount = createAction<SwitchEOSAccountParams>('wallet/SWITCH_EOS_ACCOUNT')

export const setEOSAccountPassword = createAction<SetEOSAccountPasswordParams>('wallet/SET_EOS_ACCOUNT_PASSWORD')

export const syncEOSAccount = createAction('wallet/SYNC_EOS_ACCOUNT')
export const syncEOSAccountSucceeded = createAction<SyncEOSAccountResult>('wallet/SYNC_EOS_ACCOUNT_SUCCEEDED')

export const clearAccount = createAction('wallet/CLEAR_ACCOUNT')
