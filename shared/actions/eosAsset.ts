import { createAction } from 'redux-actions'

export const getEOSAssetRequested = createAction<GetEOSAssetParams>('eosAsset/GET_REQUESTED')
export const getEOSAssetSucceeded = createAction<GetEOSAssetResult>('eosAsset/GET_SUCCEEDED')
export const getEOSAssetFailed = createAction<ErrorMessage>('eosAsset/GET_FAILED')
export const toggleEOSAsset = createAction<any>('eosAsset/TOGGLE')
export const toggleEOSAssetForStorage = createAction<any>('eosAsset/TOGGLE_FOR_STORAGE')
export const toggleEOSAssetList = createAction<any>('eosAsset/TOGGLE_LIST')
export const searchEOSAssetRequested = createAction<SearchEOSAssetParsms>('eosAsset/SEARCH_REQUESTED')
export const searchEOSAssetSucceeded = createAction<SearchEOSAssetResult>('eosAsset/SEARCH_SUCCEEDED')
export const searchEOSAssetFailed = createAction<ErrorMessage>('eosAsset/SEARCH_FAILED')
export const clearSearch = createAction('eosAsset/CLEAR_SEARCH')
export const resetEOSAsset = createAction('eosAsset/REST')
