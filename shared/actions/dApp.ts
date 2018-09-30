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
export const setSearchTerm = createAction<string>('dApp/SET_SEARCH_TERM')
export const toggleFavoriteDapp = createAction<string>('dApp/TOGGLE')
