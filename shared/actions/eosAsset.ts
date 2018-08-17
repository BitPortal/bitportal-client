import { createAction } from 'redux-actions'

export const getEosAssetRequested = createAction<eosAssetParams>(
  'eosAsset/GET_REQUESTED'
)

export const getEosAssetSucceeded = createAction<eosAssetResult>(
  'eosAsset/GET_SUCCEEDED'
)
export const getEosAssetFailed = createAction<ErrorMessage>(
  'eosAsset/GET_FAILED'
)
export const saveAssetPref = createAction<eosAssetPref>(
  'eosAsset/SAVE_ASSET_PREF'
)
export const saveAssetPrefSucceeded = createAction<eosAssetPref>(
  'eosAsset/SAVE_ASSET_PREF_SUCCEEDED'
)
export const getAssetPref = createAction<eosAssetParams>(
  'eosAsset/GET_ASSET_PREF'
)
export const getAssetPrefSucceeded = createAction<eosAssetPrefResult>(
  'eosAsset/GET_ASSET_PREF_SUCCEEDED'
)
