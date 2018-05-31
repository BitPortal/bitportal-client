import { createAction } from 'redux-actions'

export const createWalletRequested = createAction<CreateWalletParams>('wallet/CREATE_REQUESTED')
export const createHDWalletSucceeded = createAction<CreateWalletResult>('wallet/CREATE_HD_SUCCEEDED')
export const createClassicWalletSucceeded = createAction<CreateWalletResult>('wallet/CREATE_CLASSIC_SUCCEEDED')
export const createWalletFailed = createAction<ErrorMessage>('wallet/CREATE_FAILED')

export const importWalletRequested = createAction<ImportWalletParams>('wallet/IMPORT_REQUESTED')
export const importWalletSucceeded = createAction<ImportWalletResult>('wallet/IMPORT_SUCCEEDED')
export const importWalletFailed = createAction<ErrorMessage>('wallet/IMPORT_FAILED')

export const syncWalletRequested = createAction('wallet/SYNC_REQUESTED')
export const syncWalletSucceeded = createAction<SyncWalletResult>('wallet/SYNC_SUCCEEDED')
export const syncWalletFailed = createAction<ErrorMessage>('wallet/SYNC_FAILED')

export const switchWalletRequested = createAction('wallet/SWITCH_REQUESTED')
export const switchWalletSucceeded = createAction<HDWallet>('wallet/SWITCH_SUCCEEDED')
export const switchWalletFailed = createAction<ErrorMessage>('wallet/SWITCH_FAILED')

export const createWalletAndEOSAccountRequested = createAction<CreateWalletAndEOSAccountParams>('wallet/CREATE_WALLET_AND_EOS_ACCOUNT_REQUESTED')

export const resetWallet = createAction('wallet/RESET')

export const logoutRequested = createAction<LogoutParams>('wallet/LOGOUT_REQUESTED')
export const logoutSucceeded = createAction('wallet/LOGOUT_SUCCEEDED')
export const logoutFailed = createAction('wallet/LOGOUT_FAILED')
