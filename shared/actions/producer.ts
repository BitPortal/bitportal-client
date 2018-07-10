import { createAction } from 'redux-actions'

export const getProducersRequested = createAction<GetProducersParams>('producer/GET_REQUESTED')
export const getProducersSucceeded = createAction<GetProducersResult>('producer/GET_SUCCEEDED')
export const getProducersFailed = createAction<ErrorMessage>('producer/GET_FAILED')

export const getProducersInfoRequested = createAction<GetProducersInfoParams>('producer/GET_INFO_REQUESTED')
export const getProducersInfoSucceeded = createAction<GetProducersInfoResult>('producer/GET_INFO_SUCCEEDED')
export const getProducersInfoFailed = createAction<ErrorMessage>('producer/GET_INFO_FAILED')
