import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateBTCFees = createAction<UpdateBTCFees>('fee/UPDATE_BTC')
export const updateETHGasPrice = createAction<UpdateETHGasPrice>('fee/UPDATE_ETH_GAS_PRICE')
export const updateETHGasLimit = createAction<UpdateETHGasLimit>('fee/UPDATE_ETH_GAS_LIMIT')

export const getBTCFees = createAsyncAction('fee/GET_BTC')
export const getETHGasPrice = createAsyncAction('fee/GET_ETH_GAS_PRICE')
export const getETHGasLimit = createAsyncAction('fee/GET_ETH_GAS_LIMIT')
