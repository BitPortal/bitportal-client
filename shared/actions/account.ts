import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateAccount = createAction<AddAccountParams>('account/UPDATE')
export const removeAccount = createAction<RemoveAccountParams>('account/REMOVE')
export const getAccount = createAsyncAction('account/GET')
