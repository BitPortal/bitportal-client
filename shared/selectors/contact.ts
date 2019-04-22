import { createSelector } from 'reselect'

export const contactByIdSelector = (state: RootState) => state.contact.byId
export const contactAllIdsSelector = (state: RootState) => state.contact.allIds
export const activeContactIdSelector = (state: RootState) => state.contact.activeId

export const contactSelector = createSelector(
  contactByIdSelector,
  contactAllIdsSelector,
  (byId: any, allIds: any) => {
    const dict = allIds.map(id => byId[id]).reduce((a, c) => {
      let k = c.name[0].toLocaleUpperCase()
      k = /^[A-Za-z]+$/.test(k) ? k : '#'
      if (a[k]) a[k].push(c)
      else a[k] = [c]

      return a
    }, {})

    const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#']
    const contacts = sections.map(item => ({
      key: item,
      items: dict[item] ? dict[item].sort((a, b) => {
        if(a.name.toUpperCase() < b.name.toUpperCase()) {
          return -1
        } else if(a.name.toUpperCase() > b.name.toUpperCase()) {
          return 1
        }

        return 0
      }) : []
    })).filter(item => !!item.items.length)

    return contacts
  }
)

export const activeContactSelector = createSelector(
  activeContactIdSelector,
  contactByIdSelector,
  (activeId: string, byId: any) => activeId && byId[activeId]
)
