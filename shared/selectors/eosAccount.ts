import Immutable, { Map } from 'immutable'
import { createSelector } from 'reselect'

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
  (account: any) => account.getIn(['data', 'cpu_limit', 'available']) || 0
)

export const cpuLimitMaxSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'cpu_limit', 'max']) || 0
)

export const cpuLimitUsedSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'cpu_limit', 'used']) || 0
)

export const totalResourcesCPUWeightSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'total_resources', 'cpu_weight']) || '0.0000 EOS'
)

export const netLimitAvailableSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'net_limit', 'available']) || 0
)

export const netLimitMaxSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'net_limit', 'max']) || 0
)

export const netLimitUsedSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'net_limit', 'used']) || 0
)

export const totalResourcesNETWeightSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'total_resources', 'net_weight']) ||' 0.0000 EOS'
)

export const ramQuotaSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'ram_quota']) || 0
)

export const ramUsageSelector = createSelector(
  eosAccountSelector,
  (account: any) => account.getIn(['data', 'ram_usage']) || 0
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

    return Immutable.fromJS({ balance: '0.0000', symbol: 'EOS', contract: 'eosio.token', blockchain: 'EOS' })
  }
)
