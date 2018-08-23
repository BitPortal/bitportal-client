import { createAction } from 'redux-actions'

export const getEOSAssetRequested = createAction<GetEOSAssetParams>('eosAsset/GET_REQUESTED')
export const getEOSAssetSucceeded = createAction<GetEOSAssetResult>('eosAsset/GET_SUCCEEDED')
export const getEOSAssetFailed = createAction<ErrorMessage>('eosAsset/GET_FAILED')
export const toggleEOSAsset = createAction<string>('eosAsset/TOGGLE')
export const setSearchValue = createAction<string>('eosAsset/SET_SEARCH_VALUE')
export const resetSearchValue = createAction('eos/RESET_SEARCH_VALUE')
