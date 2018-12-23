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

export const EOSToolsDappSelector = createSelector(
  favoriteDappsSelector,
  (dappList: any) => {
    const item = {
      name: 'EOSX工具箱',
      display_name: {zh: 'EOSX工具箱', en: 'MyEOSKit'},
      icon_url: 'https://cdn.bitportal.io/dapps/icons/myeoskit.png',
      url: 'https://www.myeoskit.com/tools/'
    }
    if (dappList.size > 0) {
      for (let index = 0; index < dappList.length; index++) {
        const element = dappList[index];
        if (element.get && element.get('name') === 'EOSX工具箱') return Immutable.fromJS(element)
      }
      return Immutable.fromJS(item)
    } else {
      return Immutable.fromJS(item)
    }
  }
)


export const CPUEmergencyDappSelector = createSelector(
  favoriteDappsSelector,
  (dappList: any) => {
    const item = {
      name: 'CPU Emergency',
      display_name: {en: 'CPU Emergency', zh: 'CPU救援服务'},
      icon_url: 'https://cdn.bitportal.io/media/2018/05/0b8578be-discovery_logo.png',
      url: 'https://cpuemergency.com/'
    }
    if (dappList.size > 0) {
      for (let index = 0; index < dappList.length; index++) {
        const element = dappList[index]
        if (element.get && element.get('name') === 'CPU Emergency') return Immutable.fromJS(element)
      }
      return Immutable.fromJS(item)
    } else {
      return Immutable.fromJS(item)
    }
  }
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

    if (newArr.length > 10) {
      // const parsed = newArr.splice(0, 11).concat({ type: 'more' })
      const parsed = newArr.splice(0, 10)

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
    data.filter((item: any) =>
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
    const favIndex = sections.findIndex(e => e.title === 'favorite')
    if (favIndex !== -1 && item.get('selected')) sections[favIndex].data.push(item)
    else if (favIndex === -1 && item.get('selected')) sections.push({ title: 'favorite', data: [item] })
  })
  const sortedCollection = _.sortBy(sections, item => DAPP_SECTIONS.indexOf(item.title.toUpperCase()))
  return sortedCollection
})

export const hotDappsSelector = createSelector(mergeFavoritesDataSelector, (data: any) => {
  const newArr = data.filter((item: any) => item.get('is_hot'))
  if (newArr.size > 9) {
    const correctLength = newArr.splice(9)
    return correctLength
  }
  return newArr
})

export const newDappsSelector = createSelector(mergeFavoritesDataSelector, (data: any) => {
  const newArr = data.filter((item: any) => item.get('is_new'))
  if (newArr.size > 9) {
    const correctLength = newArr.splice(9)
    return correctLength
  }
  return newArr
})

export const dAppSectionsSelector = createSelector(sectionedDappListSelector, (sectionedDapps: any) =>
  sectionedDapps.filter((e: any) => e.title !== 'favorite').map((i: any) => i.title)
)
