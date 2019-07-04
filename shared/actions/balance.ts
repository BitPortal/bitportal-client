import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateBalance = createAction<AddBalanceParams>('balance/UPDATE')
export const updateBalanceList = createAction<UpdateBalanceParams>('balance/UPDATE_LIST')
export const resetBalance = createAction('balance/RESET')
export const getBalance = createAsyncAction('balance/GET')
export const getETHTokenBalance = createAsyncAction('balance/GET_ETH_TOKEN')
export const getETHTokenBalanceList = createAsyncAction('balance/GET_ETH_TOKEN_LIST')
export const getChainXTokenBalanceList = createAsyncAction('balance/GET_CHAINX_TOKEN_LIST')
export const getEOSTokenBalance = createAsyncAction('balance/GET_EOS_TOKEN')
export const getEOSTokenBalanceList = createAsyncAction('balance/GET_EOS_TOKEN_LIST')
