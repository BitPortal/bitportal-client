import { createAction } from 'redux-actions'

export const getTransactionsRequested = createAction<TransactionsParams>('transaction/GET_REQUESTED')
export const getTransactionsSucceeded = createAction<TransactionsResult>('transaction/GET_SUCCEEDED')
export const getTransactionsFailed = createAction<ErrorMessage>('transaction/GET_FAILED')
export const getTransactionDetailRequested = createAction<TransactionDetailParams>('transaction/GET_DETAIL_REQUESTED')
export const getTransactionDetailSucceeded = createAction<TransactionDetailResult>('transaction/GET_DETAIL_SUCCEEDED')
export const getTransactionDetailFailed = createAction<ErrorMessage>('transaction/GET_DETAIL_FAILED')
