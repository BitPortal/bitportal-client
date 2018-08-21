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
