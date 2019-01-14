import { createAction } from 'redux-actions'
import { createAsyncAction } from 'utils/redux'

export const updatePortfolio = createAction<UpdatePortfolioParams>('portfolio/UPDATE')
export const getPortfolio = createAsyncAction('portfolio/GET')
