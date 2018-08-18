import { createAction } from 'redux-actions'

export const getProducersRequested = createAction<GetProducersParams>('producer/GET_REQUESTED')
export const getProducersSucceeded = createAction<GetProducersResult>('producer/GET_SUCCEEDED')
export const getProducersFailed = createAction<ErrorMessage>('producer/GET_FAILED')
export const getProducersInfoRequested = createAction<GetProducersInfoParams>('producer/GET_INFO_REQUESTED')
export const getProducersInfoSucceeded = createAction<GetProducersInfoResult>('producer/GET_INFO_SUCCEEDED')
export const getProducersInfoFailed = createAction<ErrorMessage>('producer/GET_INFO_FAILED')
export const getProducersWithInfoRequested = createAction<GetProducersWithInfoParams>('producer/GET_ALL_REQUESTED')
export const getProducersWithInfoSucceeded = createAction<GetProducersWithInfoResult>('producer/GET_ALL_SUCCEEDED')
export const getProducersWithInfoFailed = createAction<ErrorMessage>('producer/GET_ALL_FAILED')
export const sortProducers = createAction<string>('producer/SORT')
