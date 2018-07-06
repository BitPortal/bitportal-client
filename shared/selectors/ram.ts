import { createSelector } from 'reselect'

const ramSelector = (state: RootState) => state.ram.get('data')

export const ramPriceSelector = createSelector(
  ramSelector,
  (data: any) => {
    const dataObj = data && data.toJS()
    if (dataObj && dataObj.rows && dataObj.rows.length > 0) {
      const info = dataObj.rows[0]
      const baseBalance = info.base.balance.split(' ')[0]
      const quoteBalance = info.quote.balance.split(' ')[0]
      const baseWeight = info.base.weight
      const quoteWeight = info.quote.weight
      // console.log("### ---- ", baseBalance, quoteBalance, quoteBalance / (baseBalance * quoteWeight))
      return quoteBalance / (baseBalance * quoteWeight)
    } else {
      return '0.0000'
    }
  }
)
