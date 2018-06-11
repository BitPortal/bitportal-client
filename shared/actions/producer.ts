import { createAction } from 'redux-actions'

export const getProducersRequested = createAction<GetProducersParams>('vote/GET_PRODUCERS_REQUESTED')
export const getProducersSucceeded = createAction<GetProducersResult>('vote/GET_PRODUCERS_SUCCEEDED')
export const getProducersFailed = createAction<ErrorMessage>('vote/GET_PRODUCERS_FAILED')

export const selectProducer = createAction('vote/SELECT_PRODUCER')
