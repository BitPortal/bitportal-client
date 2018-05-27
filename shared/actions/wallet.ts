import { createAction } from 'redux-actions'

export const createWalletRequested = createAction<CreateWalletParams>('wallet/CREATE_REQUESTED')
export const createWalletSucceeded = createAction<CreateWalletResult>('wallet/CREATE_SUCCEEDED')
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
