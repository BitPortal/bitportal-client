import { createSelector } from 'reselect'
import { Map } from 'immutable'

const walletSelector = (state: RootState) => state.wallet.get('data')
const accountSelector = (state: RootState) => state.eosAccount

export const eosAccountSelector = createSelector(
  walletSelector,
  accountSelector,
  (wallet: string, accounts: any) => {
    const bpid = wallet.get('bpid')
    const eosAccountName = wallet.get('eosAccountName')
    const origin = wallet.get('origin')
    const list = accounts.get('eosAccountList')

    if (origin === 'hd') {
      const index = list.findIndex((item: any) => item.get('bpid') === bpid)

      if (index !== -1) {
        return accounts.set('data', list.get(index))
      } else {
        return accounts.set('data', Map({}))
      }
      return accounts.set('data', Map({}))
    } else if (origin === 'classic') {
      const index = list.findIndex((item: any) => item.get('account_name') === eosAccountName)

      if (index !== -1) {
        return accounts.set('data', list.get(index))
      } else {
        return accounts.set('data', Map({}))
      }
    } else {
      return accounts.set('data', Map({}))
    }
  }
)
