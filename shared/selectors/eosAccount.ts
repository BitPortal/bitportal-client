import { createSelector } from 'reselect'
import { Map } from 'immutable'

const walletIdSelector = (state: RootState) => state.wallet.get('data').get('bpid')
const eosAccountSelector = (state: RootState) => state.eosAccount

export const activeAccountSelector = createSelector(
  walletIdSelector,
  eosAccountSelector,
  (bpid: string, accounts: any) => {
    const list = accounts.get('eosAccountList')
    let c
    if (!bpid) account = Map({})
    const index = list.findIndex((item: any) => item.get('bpid') === wallet.get('bpid'))
    if (index !== -1) ? account = list.get(index)

    return accounts.set('data', account)
  }
)
