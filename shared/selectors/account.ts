import { createSelector } from 'reselect'
import { activeWalletSelector, managingWalletSelector, bridgeWalletSelector } from './wallet'
import { initialState } from 'reducers/wallet'

export const accountByIdSelector = (state: RootState) => state.account.byId || initialState.byId
export const accountAllIdsSelector = (state: RootState) => state.account.allIds || initialState.allIds

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
    if (!byId || !wallet || wallet.chain !== 'EOS' || !wallet.address) return null
    const id = `${wallet.chain}/${wallet.address}`
    return byId[id]
  }
)

export const bridgeAccountSelector = createSelector(
  bridgeWalletSelector,
  accountByIdSelector,
  (wallet: any, byId: any) => {
    if (!byId || !wallet || wallet.chain !== 'EOS' || !wallet.address) return null
    const id = `${wallet.chain}/${wallet.address}`
    return byId[id]
  }
)

export const managingAccountSelector = createSelector(
  managingWalletSelector,
  accountByIdSelector,
  (wallet: any, byId: any) => {
    if (!byId || !wallet || wallet.chain !== 'EOS' || !wallet.address) return null
    const id = `${wallet.chain}/${wallet.address}`
    return byId[id]
  }
)

export const managingAccountTotalResourcesSelector = createSelector(
  managingAccountSelector,
  (account: any) => account && account.total_resources
)

export const managingAccountSelfDelegatedBandwidthSelector = createSelector(
  managingAccountSelector,
  (account: any) => account && account.self_delegated_bandwidth
)

export const managingAccountVotedProducersSelector = createSelector(
  managingAccountSelector,
  (account: any) => account && account.voter_info && account.voter_info.producers
)

export const managingAccountOthersDelegatedBandwidthSelector = createSelector(
  managingAccountTotalResourcesSelector,
  managingAccountSelfDelegatedBandwidthSelector,
  (account: any, selfDelegatedBandwidth: any) => {
    if (account) {
      if (selfDelegatedBandwidth) {
        return ({
          cpu_weight: `${+account.cpu_weight.split(' ')[0] - +selfDelegatedBandwidth.cpu_weight.split(' ')[0]} EOS`,
          net_weight: `${+account.net_weight.split(' ')[0] - +selfDelegatedBandwidth.net_weight.split(' ')[0]} EOS`,
        })
      }

      return ({
        cpu_weight: account.cpu_weight,
        net_weight: account.net_weight
      })
    }

    return null
  }
)
