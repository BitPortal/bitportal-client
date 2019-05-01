import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateETHAsset = createAction<UpdateETHAsset>('asset/UPDATE_ETH')
export const updateEOSAsset = createAction<UpdateETHAsset>('asset/UPDATE_EOS')

export const getETHAsset = createAsyncAction<GetETHAsset>('asset/GET_ETH')
export const getEOSAsset = createAsyncAction<GetEOSAsset>('asset/GET_EOS')
