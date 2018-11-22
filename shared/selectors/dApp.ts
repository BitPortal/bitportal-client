import { createSelector } from 'reselect'
import Immutable from 'immutable'
import _ from 'lodash'
import { DAPP_SECTIONS } from 'constants/dApp'

const dataSelector = (state: RootState) =>
  state.dApp.get('data').filter((item: any) => item.get('status') === 'published')
const searchTermSelector = (state: RootState) => state.dApp.get('searchTerm')
const locale = (state: RootState) => state.intl.get('locale')
export const favoriteDappsSelector = (state: RootState) => state.dApp.get('favoriteDapps')

export const getInitialDapp = (storedFavoriteDapps?: any) =>
  Immutable.fromJS({
    data: [],
    loading: false,
    loaded: false,
    error: null,
    searchTerm: '',
    favoriteDapps: storedFavoriteDapps || []
  })

export const mergeFavoritesDataSelector = createSelector(
  favoriteDappsSelector,
  dataSelector,
  (favoriteDapps: any, data: any) =>
    data.map((item: any) => {
      const index = favoriteDapps.findIndex((e: any) => e.get('name') === item.get('name'))
      return item.set('selected', index !== -1)
    })
)

export const parsedDappListSelector = createSelector(
  favoriteDappsSelector,
  dataSelector,
  (favoriteDapps: any, data: any) => {
    const newArr = [...favoriteDapps.toJS()]
    data.forEach((item: any) => {
      const found = newArr.find((i: any) => i.name === item.get('name'))
      return found ? null : newArr.push(item.toJS())
    })

    if (newArr.length > 8) {
      // const parsed = newArr.splice(0, 11).concat({ type: 'more' })
      const parsed = newArr.splice(0, 8)

      return Immutable.fromJS(parsed)
    }
    return Immutable.fromJS(data.splice(0, 11))
  }
)

export const searchDappListSelector = createSelector(
  mergeFavoritesDataSelector,
  searchTermSelector,
  locale,
  (data: any, searchTerm: any, locale: any) =>
    data.filter(
      (item: any) =>
        searchTerm.trim() === ''
          ? item
          : item
              .get('display_name')
              .get(locale)
              .toUpperCase()
              .includes(searchTerm.toUpperCase())
    )
)
// [{title:category,data:[item1,item2]}]
export const sectionedDappListSelector = createSelector(searchDappListSelector, (resultsList: any) => {
  const sections: any[] = []
  resultsList.forEach((item: any) => {
    const sectionIndex = sections.findIndex(e => e.title === item.get('category'))
    if (sectionIndex !== -1) sections[sectionIndex].data.push(item)
    else sections.push({ title: item.get('category'), data: [item] })
  })
  const sortedCollection = _.sortBy(sections, item => DAPP_SECTIONS.indexOf(item.title.toUpperCase()))
  return sortedCollection
})
