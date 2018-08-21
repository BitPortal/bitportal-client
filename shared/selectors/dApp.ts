import { createSelector } from 'reselect'

const dataSelector = (state: RootState) => state.dApp.get('data')
const searchTermSelector = (state: RootState) => state.dApp.get('searchTerm')
const locale = (state: RootState) => state.intl.get('locale')

export const parsedDappListSelector = createSelector(
  dataSelector,
  (data: any) => {
    let newArr = []
    // if (data.size > 11) {
    newArr = data.splice(11).push({ type: 'more' })
    return newArr
    // }
    return data
  }
)

export const searchDappListSelector = createSelector(
  dataSelector,
  searchTermSelector,
  locale,
  (data: any, searchTerm: any, locale: any) => data.filter(
    (item: any) => (searchTerm.trim() === ''
      ? item
      : item
        .get('display_name')
        .get(locale)
        .includes(searchTerm))
  )
)
