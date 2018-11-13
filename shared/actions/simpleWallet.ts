import { createAction } from 'redux-actions'

export const loginSWAuthRequested = createAction<LoginSWAuthParams>('simpleWallet/LOGIN_REQUESTED')
export const loginSWAuthSucceeded = createAction<LoginSWAuthResult>('simpleWallet/LOGIN_SUCCEEDED')
export const loginSWAuthFailed = createAction<ErrorMessage>('simpleWallet/LOGIN_FAILED')

// export const transactionSWRequested = createAction<transactionSWRequested>('simpleWallet/TRANSACTION_REQUESTED')
// export const transactionSWSucceeded = createAction<transactionSWResult>('simpleWallet/TRANSACTION_SUCCEEDED')
// export const transactionSWFailed = createAction<ErrorMessage>('simpleWallet/TRANSACTION_FAILED')

export const clearSWError = createAction('simpleWallet/CLEAR_ERROR')
