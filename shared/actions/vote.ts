import { createAction } from 'redux-actions'

export const getVoteDataRequested = createAction<VoteParams>('vote/GET_VOTE_DATA_REQUESTED')
export const getVoteDataSucceeded = createAction<VoteResult>('vote/GET_VOTE_DATA_SUCCEEDED')
export const getVoteDataFailed = createAction<ErrorMessage>('vote/GET_VOTE_DATA_FAILED')

export const selectProducer = createAction('vote/SELECT_PRODUCER')