import { createAction } from 'redux-actions'

export const getProducersRequested = createAction<GetProducersParams>('producer/GET_REQUESTED')
export const getProducersSucceeded = createAction<GetProducersResult>('producer/GET_SUCCEEDED')
export const getProducersFailed = createAction<ErrorMessage>('producer/GET_FAILED')
