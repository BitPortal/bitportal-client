import { createAction } from 'redux-actions'

export const getNewsListRequested = createAction<NewsParams>('news/GET_LIST_REQUESTED')
export const getNewsListSucceeded = createAction<any>('news/GET_LIST_SUCCEEDED')
export const getNewsListFailed = createAction<ErrorMessage>('News/GET_LIST_FAILED')
export const getNewsBannerRequested = createAction<any>('news/GET_BANNER_REQUESTED')
export const getNewsBannerSucceeded = createAction<any>('news/GET_BANNER_SUCCEEDED')
export const getNewsBannerFailed = createAction<ErrorMessage>('news/GET_BANNER_FAILED')

export const getLocalBanners = createAction('news/GET_LOCAL_BANNERS')