import { createAction } from 'redux-actions'

export const transferRequested = createAction<TransferParams>('transfer/REQUESTED')
export const transferSucceeded = createAction<TransferResult>('transfer/SUCCEEDED')
export const transferFailed = createAction<ErrorMessage>('transfer/FAILED')
export const clearTransferError = createAction('transfer/CLEAR_ERROR')
export const openTransferModal = createAction('transfer/SHOW_MODAL')
export const closeTransferModal = createAction('transfer/CLOSE_MODAL')
