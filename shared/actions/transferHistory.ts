import { createAction } from 'redux-actions'

export const getTransferHistoryRequested = createAction<TransferHistoryParams>('transferHistory/GET_REQUESTED')
export const getTransferHistorySucceeded = createAction<TransferHistoryResult>('transferHistory/GET_SUCCEEDED')
export const getTransferHistoryFailed = createAction<ErrorMessage>('transferHistory/GET_FAILED')
