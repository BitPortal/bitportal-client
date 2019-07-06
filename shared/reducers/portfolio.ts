import { handleActions } from 'utils/redux'
import * as actions from 'actions/portfolio'

export const initialState = {
  byId: {},
  allIds: []
}

export default handleActions({
  [actions.updatePortfolio] (state, action) {
    const portfolio = action.payload
    state.byId[portfolio.id] = portfolio
    const index = state.allIds.findIndex((v: any) => v === portfolio.id)
    if (index === -1) state.allIds.push(portfolio.id)
  }
}, initialState)
