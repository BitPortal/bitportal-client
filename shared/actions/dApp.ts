import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updateDapp = createAction<AddDappParams>('dapp/UPDATE')
export const updateDappRecommend = createAction<AddDappRecommendParams>('dapp/UPDATE_RECOMMEND')
export const getDapp = createAsyncAction('dapp/GET')
export const getDappRecommend = createAsyncAction('dapp/GET_RECOMMEND')
