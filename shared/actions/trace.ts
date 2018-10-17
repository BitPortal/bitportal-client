import { createAction } from 'redux-actions'

export const traceTransaction = createAction<TraceTransactionParams>('trace/STAKE')
export const traceStake = createAction<TraceStakeParams>('trace/STAKE')
export const traceVotes = createAction<TraceVotesParams>('trace/VOTES')
export const traceImport = createAction<TraceImportParams>('trace/IMPORT')