import { createSelector } from 'reselect'
import { Map } from 'immutable'

const walletIdSelector = (state: RootState) => state.wallet.get('data').get('bpid')
const accountSelector = (state: RootState) => state.eosAccount

export const eosAccountSelector = createSelector(
  walletIdSelector,
  accountSelector,
  (bpid: string, accounts: any) => {
    const list = accounts.get('eosAccountList')
    if (!bpid) return accounts.set('data', Map({}))

    const index = list.findIndex((item: any) => item.get('bpid') === bpid)

    if (index !== -1) {
      return accounts.set('data', list.get(index))
    } else {
      return accounts.set('data', Map({}))
    }
  }
)
