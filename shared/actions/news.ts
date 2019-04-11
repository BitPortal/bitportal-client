import { createAction } from 'redux-actions'
import { createAsyncAction } from '../utils/redux'

export const updateNews = createAction('news/UPDATE_NEWS')
export const getNews = createAsyncAction('news/GET')
