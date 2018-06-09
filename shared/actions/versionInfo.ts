import { createAction } from 'redux-actions'

export const getVersionInfoRequested = createAction('versionInfo/GET_REQUESTED')
export const getVersionInfoSucceeded = createAction<object>('versionInfo/GET_SUCCEEDED')
export const getVersionInfoFailed = createAction<ErrorMessage>('versionInfo/GET_FAILED')
