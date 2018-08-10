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
