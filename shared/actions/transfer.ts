import { createAction } from 'redux-actions'

export const transferRequested = createAction<TransferParams>('transfer/REQUESTED')
export const transferSucceeded = createAction<TransferResult>('transfer/SUCCEEDED')
export const transferFailed = createAction<ErrorMessage>('transfer/FAILED')
