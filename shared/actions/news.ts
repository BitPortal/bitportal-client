import { createAction } from 'redux-actions'

export const getNewsRequested = createAction<NewsParams>('News/GET_REQUESTED')
export const getNewsSucceeded = createAction<any>('News/GET_SUCCEEDED')
export const getNewsFailed = createAction<ErrorMessage>('News/GET_FAILED')
