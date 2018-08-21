import { createAction } from 'redux-actions'

export const getDappListRequested = createAction<TokenParams>(
  'dApp/GET_LIST_REQUESTED'
)
export const getDappListSucceeded = createAction<TokenResult>(
  'dApp/GET_LIST_SUCCEEDED'
)
export const getDappListFailed = createAction<ErrorMessage>(
  'dApp/GET_LIST_FAILED'
)
