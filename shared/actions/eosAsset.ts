import { createAction } from 'redux-actions'

export const getEOSAssetRequested = createAction<GetEOSAssetParams>('eosAsset/GET_REQUESTED')
export const getEOSAssetSucceeded = createAction<GetEOSAssetResult>('eosAsset/GET_SUCCEEDED')
export const getEOSAssetFailed = createAction<ErrorMessage>('eosAsset/GET_FAILED')
export const toggleEOSAsset = createAction<string>('eosAsset/TOGGLE')
export const searchEOSAssetRequested = createAction<string>('eosAsset/SEARCH_REQUESTED')
export const searchEOSAssetSucceeded = createAction<SearchEOSAssetResult>('eosAsset/SEARCH_SUCCEEDED')
export const searchEOSAssetFailed = createAction<ErrorMessage>('eosAsset/SEARCH_FAILED')
export const clearSearch = createAction('eos/CLEAR_SEARCH')
