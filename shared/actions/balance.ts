import { createAction } from 'redux-actions'

export const getEOSBalanceRequested = createAction<GetAssetBalanceParams>('balance/GET_EOS_REQUESTED')
export const getEOSBalanceSucceeded = createAction<GetAssetBalanceResult>('balance/GET_EOS_SUCCEEDED')
export const getEOSBalanceFailed = createAction<ErrorMessage>('balance/GET_EOS_FAILED')
export const getEOSAssetBalanceRequested = createAction<GetAssetBalanceParams>('balance/GET_EOS_ASSET_REQUESTED')
export const getEOSAssetBalanceSucceeded = createAction<GetAssetBalanceResult>('balance/GET_EOS_ASSET_SUCCEEDED')
export const getEOSAssetBalanceFailed = createAction<ErrorMessage>('balance/GET_EOS_ASSET_FAILED')
export const getEOSAssetBalanceListRequested = createAction<GetAssetBalanceListParams>('balance/GET_LIST_REQUESTED')
export const getEOSAssetBalanceListSucceeded = createAction<GetAssetBalanceListResult>('balance/GET_LIST_SUCCEEDED')
export const getEOSAssetBalanceListFailed = createAction<ErrorMessage>('balance/GET_LIST_FAILED')
export const setActiveAsset = createAction<string>('balance/SET_ACTIVE_ASSET')
export const resetBalance = createAction('balance/RESET')
