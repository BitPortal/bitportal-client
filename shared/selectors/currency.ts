import { createSelector } from 'reselect'

export const currencySymbolSelector = (state: RootState) => state.currency.symbol
export const currencyListSelector = (state: RootState) => state.currency.list

export const currencySelector = createSelector(
  currencySymbolSelector,
  currencyListSelector,
  (symbol: any, list: any) => list[symbol]
)
