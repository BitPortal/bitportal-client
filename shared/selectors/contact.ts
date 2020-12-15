import { createSelector } from 'reselect'
import { transferWalletSelector } from 'selectors/wallet'
import { withdrawAssetSelector } from 'selectors/asset'
import { initialState } from 'reducers/contact'
import {getChain} from '../utils/riochain'

export const contactByIdSelector = (state: RootState) => state.contact.byId || initialState.byId
export const contactAllIdsSelector = (state: RootState) => state.contact.allIds || initialState.allIds
export const activeContactIdSelector = (state: RootState) => state.contact.activeId || initialState.activeId
export const selectedContactInfoSelector = (state: RootState) => state.contact.selected || initialState.selected

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

export const transferWalletsContactsSelector = createSelector(
  transferWalletSelector,
  contactByIdSelector,
  contactAllIdsSelector,
  (wallet: any, byId: any, allIds: any) => {

    if (!wallet || !wallet.chain) return []

    let chainSymbol

    if (wallet.chain === 'BITCOIN') {
      chainSymbol = 'btc'
    } else if (wallet.chain === 'ETHEREUM') {
      chainSymbol = 'eth'
    } else if (wallet.chain === 'EOS') {
      chainSymbol = 'eos'
    } else if (wallet.chain === 'POLKADOT') {
      chainSymbol = 'rio'
    } else {
      return []
    }

    const contacts = allIds.map(id => byId[id])
      .filter(item => item[chainSymbol] && item[chainSymbol].length)
      .map(item => ({ id: item.id, name: item.name, description: item.description, address: item[chainSymbol] }))
      .sort((a, b) => {
        if(a.name.toUpperCase() < b.name.toUpperCase()) {
          return -1
        } else if(a.name.toUpperCase() > b.name.toUpperCase()) {
          return 1
        }

        return 0
      }).reduce((a, b) => {
        const addresses = b.address.map(item => ({ id: b.id, name: b.name, description: b.description, ...item }))
        return [...a, ...addresses]
      }, [])

      console.warn('contacts:',contacts)
    return contacts
  }
)

export const withdrawContactSelector = createSelector(
  withdrawAssetSelector,
  contactByIdSelector,
  contactAllIdsSelector,
  (withdrawAsset: any, byId: any, allIds: any) => {
    const symbol = withdrawAsset.symbol || ''
    const chainSymbol = (getChain(symbol.toUpperCase()) || '').toLowerCase()
    const contacts = allIds.map(id => byId[id])
      .filter(item => item[chainSymbol] && item[chainSymbol].length)
      .map(item => ({ id: item.id, name: item.name, description: item.description, address: item[chainSymbol] }))
      .sort((a, b) => {
        if(a.name.toUpperCase() < b.name.toUpperCase()) {
          return -1
        } else if(a.name.toUpperCase() > b.name.toUpperCase()) {
          return 1
        }

        return 0
      }).reduce((a, b) => {
        const addresses = b.address.map(item => ({ id: b.id, name: b.name, description: b.description, ...item }))
        return [...a, ...addresses]
      }, [])

    console.warn('wd contacts:',contacts)
    return contacts
  })

export const activeContactSelector = createSelector(
  activeContactIdSelector,
  contactByIdSelector,
  (activeId: string, byId: any) => activeId && byId[activeId]
)

export const selectedContactSelector = createSelector(
  selectedContactInfoSelector,
  contactByIdSelector,
  (info: string, byId: any) => {
    if (info && byId) {
      const id = info.id
      let chainSymbol

      if (info.chain === 'BITCOIN') {
        chainSymbol = 'btc'
      } else if (info.chain === 'ETHEREUM') {
        chainSymbol = 'eth'
      } else if (info.chain === 'EOS') {
        chainSymbol = 'eos'
      }  else if (info.chain === 'POLKADOT') {
        chainSymbol = 'rio'
      } else {
        return null
      }

      const contact = byId[id]
      const addresses = contact[chainSymbol]
      const index = addresses.findIndex(item => item.address === info.address || item.accountName === info.address)
      if (index !== -1) {
        const address = addresses[index]

        return ({ ...info, ...address })
      }
    }

    return null
  }
)
