import { createSelector } from 'reselect'
import { managingWalletSelector } from 'selectors/wallet'

export const addressByIdSelector = (state: RootState) => state.address.byId
export const childAddressByIdSelector = (state: RootState) => state.address.child && state.address.child.byId

export const managingWalletAddressSelector = createSelector(
  managingWalletSelector,
  addressByIdSelector,
  (wallet: any, byId: any) => {
    if (!byId || !wallet || wallet.chain !== 'BITCOIN') return null

    const id = `${wallet.chain}/${wallet.address}`
    if (byId[id] && byId[id].external) {
      const external = byId[id].external
      const externalAddresses = external.allIds.map(id => external.byId[id])
      return externalAddresses
    }

    return null
  }
)

export const managingWalletChildAddressSelector = createSelector(
  managingWalletSelector,
  childAddressByIdSelector,
  (wallet: any, byId: any) => {
    if (!byId || !wallet || wallet.chain !== 'BITCOIN') return null
    const id = `${wallet.chain}/${wallet.address}`
    return byId[id]
  }
)
