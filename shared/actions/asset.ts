import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateAsset = createAction<UpdateAsset>('asset/UPDATE')
export const addAsset = createAction<AddAsset>('asset/Add')

export const selectAsset = createAction<SelectAsset>('asset/SELECT')
export const selectAssetList = createAction<SelectAssetList>('asset/SELECT_LIST')
export const unselectAsset = createAction<unSelectAsset>('asset/UNSELECT')

export const setActiveAsset = createAction<SetActiveAssetParams>('asset/SET_ACTIVE')
export const setTransferAsset = createAction<SetTransferAssetParams>('asset/SET_TRANSFER')
export const setAssetSearchText = createAction<SetAssetSearchTextParams>('asset/SET_ASSET_SEARCH_TEXT')
export const handleAssetSearchTextChange = createAction<HandleAssetSearchTextChangeParams>('asset/HANDLE_ASSET_SEARCH_TEXT_CHANGE')

export const getETHAsset = createAsyncAction<GetETHAsset>('asset/GET_ETH')
export const getEOSAsset = createAsyncAction<GetEOSAsset>('asset/GET_EOS')
export const getChainXAsset = createAsyncAction<GetEOSAsset>('asset/GET_ChainX')

export const scanEOSAsset = createAsyncAction<ScanEOSAsset>('asset/SCAN_EOS')
