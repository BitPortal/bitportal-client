import { createAction } from 'redux-actions'

export const delegateBandwidthRequested = createAction<DelegateBandwidthParams>('bandwidth/DELEGATE_REQUESTED')
export const delegateBandwidthSucceeded = createAction<DelegateBandwidthResult>('bandwidth/DELEGATE_SUCCEEDED')
export const delegateBandwidthFailed = createAction<ErrorMessage>('bandwidth/DELEGATE_FAILED')

export const undelegateBandwidthRequested = createAction<UndelegateBandwidthParams>('bandwidth/UNDELEGATE_REQUESTED')
export const undelegateBandwidthSucceeded = createAction<UndelegateBandwidthResult>('bandwidth/UNDELEGATE_SUCCEEDED')
export const undelegateBandwidthFailed = createAction<ErrorMessage>('bandwidth/UNDELEGATE_FAILED')

export const clearError = createAction('bandwidth/CLEAR_ERROR')
export const hideSuccessModal = createAction('bandwidth/HIDE_SUCCESS_MODAL')
