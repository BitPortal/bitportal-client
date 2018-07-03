import { createAction } from 'redux-actions'

export const stakeRequested = createAction<StakeParams>('stake/REQUESTED')
export const stakeSucceeded = createAction<StakeResult>('stake/SUCCEEDED')
export const stakeFailed = createAction<ErrorMessage>('stake/FAILED')
export const unstakeRequested = createAction<UnstakeParams>('unstake/REQUESTED')
export const unstakeSucceeded = createAction<UnstakeResult>('unstake/SUCCEEDED')
export const unstakeFailed = createAction<ErrorMessage>('unstake/FAILED')
export const clearError = createAction('stake/CLEAR_ERROR')
