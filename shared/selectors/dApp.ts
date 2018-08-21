import { createSelector } from 'reselect'

const dataSelector = (state: RootState) => state.dApp.get('data')

export const parsedDappListSelector = createSelector(
  dataSelector,
  (data: any) => {
    let newArr = []
    if (data.size > 11) {
      newArr = data.splice(11).push({ type: 'more' })
      return newArr
    }
    return data
  }
)
