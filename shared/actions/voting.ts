import { createAction } from 'redux-actions'

export const votingRequested = createAction<VotingParams>('voting/REQUESTED')
export const votingSucceeded = createAction<VotingResult>('voting/SUCCEEDED')
export const votingFailed = createAction<ErrorMessage>('voting/FAILED')
export const clearVotingError = createAction<ErrorMessage>('voting/CLEAR_ERROR')
export const showSelected = createAction('voting/SHOW_SELECTED')
export const closeSelected = createAction('voting/CLOSE_SELECTED')
