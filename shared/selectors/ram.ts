import { createSelector } from 'reselect'

const ramSelector = (state: RootState) => state.ram.get('data')

export const ramPriceSelector = createSelector(
  ramSelector,
  (data: any) => {
    const info = data.getIn(['rows', 0])

    if (info && info.getIn(['base', 'balance']) && info.getIn(['quote', 'balance'])) {
      const baseBalance = info.getIn(['base', 'balance']).split(' ')[0]
      const quoteBalance = info.getIn(['quote', 'balance']).split(' ')[0]
      return +quoteBalance / +baseBalance
    }

    return 0
  }
)
