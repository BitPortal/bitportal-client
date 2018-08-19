import { createAction } from 'redux-actions'

export const getVersionInfoRequested = createAction('version/GET_REQUESTED')
export const getVersionInfoSucceeded = createAction<object>('version/GET_SUCCEEDED')
export const getVersionInfoFailed = createAction<ErrorMessage>('version/GET_FAILED')
