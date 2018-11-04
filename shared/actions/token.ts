import { createAction } from 'redux-actions'

export const getTokenDetailRequested = createAction<TokenParams>('token/GET_REQUESTED')
export const getTokenDetailSucceeded = createAction<TokenResult>('token/GET_SUCCEEDED')
export const getTokenDetailFailed = createAction<ErrorMessage>('token/GET_FAILED')
export const clearToken = createAction('token/CLEAR_TOKEN')
