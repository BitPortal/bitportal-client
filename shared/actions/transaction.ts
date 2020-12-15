import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateTransactions = createAction('transaction/UPDATE_LIST')
export const removeTransactions = createAction('transaction/REMOVE')
export const updateTransaction = createAction('transaction/UPDATE')
export const addTransaction = createAction('transaction/ADD')
export const addTransactions = createAction('transaction/ADD_LIST')
export const sortTransaction = createAction('transaction/SORT')
export const setActiveTransactionId = createAction('transaction/SET_ACTIVE')
export const setLoadingMore = createAction('transaction/SET_LOADING_MORE')

export const getTransactions = createAsyncAction('transaction/GET_LIST')
export const getTransaction = createAsyncAction('transaction/GET')

export const transfer = createAsyncAction('transaction/TRANSFER')
export const vote = createAsyncAction('transaction/VOTE')
export const buyRAM = createAsyncAction('transaction/buy_RAM')
export const sellRAM = createAsyncAction('transaction/sell_RAM')
export const delegateBW = createAsyncAction('transaction/delegate_BW')
export const undelegateBW = createAsyncAction('transaction/undelegate_BW')

export const authorizeEOSAccount = createAsyncAction('transaction/AUTHORIZE_EOS_ACCOUNT')
export const authorizeCreateEOSAccount = createAsyncAction('transaction/AUTHORIZE_CREATE_EOS_ACCOUNT')

export const withdrawAsset = createAsyncAction('transaction/WITHDRAW_ASSET')

