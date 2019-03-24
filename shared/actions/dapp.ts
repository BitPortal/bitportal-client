import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateDapp = createAction<AddDappParams>('dapp/UPDATE')
export const updateDappRecommend = createAction<AddDappRecommendParams>('dapp/UPDATE_RECOMMEND')
export const setDappFilter = createAction<string>('dapp/SET_FILTER')
export const clearDappFilter = createAction('dapp/CLEAR_FILTER')
export const getDapp = createAsyncAction('dapp/GET')
export const getDappRecommend = createAsyncAction('dapp/GET_RECOMMEND')
export const bookmarkDapp = createAction<BookmarkDappParams>('dapp/BOOKMARK')
export const unBookmarkDapp = createAction<BookmarkDappParams>('dapp/UNBOOKMARK')
