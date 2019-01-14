import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateUTXO = createAction<UpdateUTXOParams>('utxo/update')
export const getUTXO = createAsyncAction('utxo/GET')
