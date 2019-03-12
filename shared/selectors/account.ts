import { createSelector } from 'reselect'
import { activeWalletSelector } from './wallet'

export const accountByIdSelector = (state: RootState) => state.account.byId
const accountAllIdsSelector = (state: RootState) => state.account.allIds

export const accountResourcesByIdSelector = createSelector(
  accountByIdSelector,
  (byId: any) => {
    if (!byId) return null

    let resources = {}

    for (var key in byId) {
      resources[key] = {
        CPU: byId[key].cpu_limit.available,
        NET: byId[key].net_limit.available,
        RAM: byId[key].ram_quota - byId[key].ram_usage
      }
    }

    return resources
  }
)

export const activeAccountSelector = createSelector(
  activeWalletSelector,
  accountByIdSelector,
  (wallet: any, byId: any) => {
    if (!byId && !wallet && wallet.chain !== 'EOS' && !wallet.address) return null
    const id = `${wallet.chain}/${wallet.address}`
    return byId[id]
  }
)
