import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateKeyAccount = createAction<AddKeyAccountParams>('keyAccount/UPDATE')
export const removeKeyAccount = createAction<RemoveKeyAccountParams>('keyAccount/REMOVE')
export const getKeyAccount = createAsyncAction('keyAccount/GET')
