import { createAction } from 'redux-actions'

export const getEOSAssetRequested = createAction<GetEOSAssetParams>('eosAsset/GET_REQUESTED')
export const getEOSAssetSucceeded = createAction<GetEOSAssetResult>('eosAsset/GET_SUCCEEDED')
export const getEOSAssetFailed = createAction<ErrorMessage>('eosAsset/GET_FAILED')
export const saveAssetPref = createAction<SaveEOSAssetPref>('eosAsset/SAVE_ASSET_PREF')
export const saveAssetPrefSucceeded = createAction<SaveEOSAssetPref>('eosAsset/SAVE_ASSET_PREF_SUCCEEDED')
export const getAssetPref = createAction<GetEOSAssetPrefParams>('eosAsset/GET_ASSET_PREF')
export const getAssetPrefSucceeded = createAction<GetEOSAssetPrefResult>('eosAsset/GET_ASSET_PREF_SUCCEEDED')
