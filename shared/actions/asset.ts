import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateAsset = createAction<UpdateAsset>('asset/UPDATE')

export const selectAsset = createAction<SelectAsset>('asset/SELECT')
export const selectAssetList = createAction<SelectAssetList>('asset/SELECT_LIST')
export const unselectAsset = createAction<unSelectAsset>('asset/UNSELECT')

export const setActiveAsset = createAction<SetActiveAssetParams>('asset/SET_ACTIVE')
export const setTransferAsset = createAction<SetTransferAssetParams>('asset/SET_TRANSFER')

export const getETHAsset = createAsyncAction<GetETHAsset>('asset/GET_ETH')
export const getEOSAsset = createAsyncAction<GetEOSAsset>('asset/GET_EOS')

export const scanEOSAsset = createAsyncAction<ScanEOSAsset>('asset/SCAN_EOS')
