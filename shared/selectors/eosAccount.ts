import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { Map } from 'immutable'

const walletSelector = (state: RootState) => state.wallet.get('data')
const accountSelector = (state: RootState) => state.eosAccount

export const eosAccountSelector = createSelector(
  walletSelector,
  accountSelector,
  (wallet: any, accounts: any) => {
    const bpid = wallet.get('bpid')
    const eosAccountName = wallet.get('eosAccountName')
    const origin = wallet.get('origin')
    const list = accounts.get('eosAccountList')

    if (origin === 'hd') {
      const index = list.findIndex((item: any) => item.get('bpid') === bpid)
      return accounts.set('data', index !== -1 ? list.get(index) : Map({}))
    } else if (origin === 'classic') {
      const index = list.findIndex((item: any) => item.get('account_name') === eosAccountName)
      return accounts.set('data', index !== -1 ? list.get(index) : Map({}))
    }

    return accounts.set('data', Map({}))
  }
)

export const eosAccountNameSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'account_name'])
)

export const voterInfoSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'voter_info'])
)

export const votedProducersSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'voter_info', 'producers'])
)

export const cpuLimitAvailableSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'cpu_limit', 'available'])
)

export const cpuLimitMaxSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'cpu_limit', 'max'])
)

export const cpuLimitUsedSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'cpu_limit', 'used'])
)

export const totalResourcesCPUWeightSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'total_resources', 'cpu_weight'])
)

export const netLimitAvailableSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'net_limit', 'available'])
)

export const netLimitMaxSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'net_limit', 'max'])
)

export const netLimitUsedSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'net_limit', 'used'])
)

export const totalResourcesNETWeightSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'total_resources', 'net_weight'])
)

export const ramQuotaSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'ram_quota'])
)

export const ramUsageSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'ram_usage'])
)

export const ramAvailableSelector = createSelector(
  ramQuotaSelector,
  ramUsageSelector,
  (quota: number, usage: number) => quota - usage
)

export const ramAvailablePercentSelector = createSelector(
  ramQuotaSelector,
  ramUsageSelector,
  (quota: number, usage: number) => (quota - usage) / quota
)

export const eosCoreLiquidBalanceSelector = createSelector(
  eosAccountSelector,
  (eosAccount: any) => {
    const core_liquid_balance = eosAccount.getIn(['data', 'core_liquid_balance'])

    if (core_liquid_balance && typeof core_liquid_balance === 'string') {
      const balance = core_liquid_balance.split(' ')[0]
      const symbol = core_liquid_balance.split(' ')[1]
      const blockchain = 'EOS'
      const contract = 'eosio.token'

      return Immutable.fromJS({ balance, symbol, contract, blockchain })
    }

    return null
  }
)
