import { createSelector } from 'reselect'
import { initialState } from 'reducers/currency'

export const currencySymbolSelector = (state: RootState) => state.currency.symbol || initialState.symbol
export const currencyListSelector = (state: RootState) => state.currency.list || initialState.list

export const currencySelector = createSelector(
  currencySymbolSelector,
  currencyListSelector,
  (symbol: any, list: any) => list[symbol]
)
