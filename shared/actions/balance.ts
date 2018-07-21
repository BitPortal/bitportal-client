import { createAction } from 'redux-actions'

export const getBalanceRequested = createAction<BalanceParams>('balance/GET_REQUESTED')
export const getBalanceSucceeded = createAction<GetEOSBalanceResult>('balance/GET_SUCCEEDED')
export const getBalanceFailed = createAction<ErrorMessage>('balance/GET_FAILED')
export const setActiveAsset = createAction<string>('balance/SET_ACTIVE_ASSET')
export const resetBalance = createAction('balance/RESET')
