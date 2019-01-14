import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateTransactions = createAction<UpdateTransactionsParams>('transaction/UPDATE_LIST')
export const removeTransactions = createAction<RemoveTransactionParams>('transaction/REMOVE')
export const updateTransaction = createAction<UpdateTransactionParams>('transaction/UPDATE')
export const addTransaction = createAction<AddTransactionParams>('transaction/ADD')
export const sortTransaction = createAction<AddTransactionParams>('transaction/SORT')
export const setActiveTransactionId = createAction<SetActiveTransactionIdParams>('transaction/SET_ACTIVE')

export const getTransactions = createAsyncAction('transaction/GET_LIST')
export const getTransaction = createAsyncAction('transaction/GET')

export const transfer = createAsyncAction('transaction/transfer')
