import { createAction } from 'redux-actions'

export const votingRequested = createAction<object>('voting/REQUESTED')
export const votingSucceeded = createAction<object>('voting/SUCCEEDED')
export const votingFailed = createAction<ErrorMessage>('voting/FAILED')
export const clearError = createAction<ErrorMessage>('voting/CLEAR_ERROR')
export const showSelected = createAction('voting/SHOW_SELECTED')
export const closeSelected = createAction('voting/CLOSE_SELECTED')
