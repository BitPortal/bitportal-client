import { createAction } from 'redux-actions'

export const getNewsListRequested = createAction<NewsParams>('News/GET_LIST_REQUESTED')
export const getNewsListSucceeded = createAction<any>('News/GET_LIST_SUCCEEDED')
export const getNewsListFailed = createAction<ErrorMessage>('News/GET_LIST_FAILED')

export const getNewsBannerRequested = createAction<any>('News/GET_BANNER_REQUESTED')
export const getNewsBannerSucceeded = createAction<any>('News/GET_BANNER_SUCCEEDED')
export const getNewsBannerFailed = createAction<ErrorMessage>('News/GET_BANNER_FAILED')
