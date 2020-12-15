import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const getBitcoinDepositAddress = createAsyncAction('wallet/GET_BITCOIN_DEPOSIT_ADDRESS')
export const updateBitcoinDepositAddress = createAction('wallet/UPDATE_BITCOIN_DEPOSIT_ADDRESS')

export const getBitcoinDepositAddressOnChain = createAsyncAction('wallet/GET_BITCOIN_DEPOSIT_ADDRESS_ON_CHAIN')
export const updateBitcoinDepositAddressOnChain = createAction('wallet/UPDATE_BITCOIN_DEPOSIT_ADDRESS_ON_CHAIN')

export const getDepositAddressOnChain = createAsyncAction('wallet/GET_DEPOSIT_ADDRESS_ON_CHAIN')
export const updateDepositAddress = createAction('wallet/UPDATE_DEPOSIT_ADDRESS_ON_CHAIN')

export const applyIdOnChain = createAsyncAction('wallet/APPLY_ID_ON_CHAIN')
export const getIdOnChain = createAsyncAction('wallet/GET_ID_ON_CHAIN')
export const updateIdOnChain = createAction('wallet/UPDATE_ID_ON_CHAIN')
