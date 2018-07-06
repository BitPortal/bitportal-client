import { createSelector } from 'reselect'

const ramSelector = (state: RootState) => state.ram.get('data')

export const ramPriceSelector = createSelector(
  ramSelector,
  (data: any) => {
    if (data.get('rows') && data.get('rows').size && data.get('rows').get(0)) {
      const info = data.get('rows').get(0)

      if (info.get('base') && info.get('base').get('balance') && info.get('quote') && info.get('quote').get('balance')) {
        const baseBalance = info.get('base').get('balance').split(' ')[0]
        const quoteBalance = info.get('quote').get('balance').split(' ')[0]
        return +quoteBalance / +baseBalance
      }
    }

    return 0
  }
)
