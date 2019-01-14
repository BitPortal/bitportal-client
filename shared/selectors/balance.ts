import { createSelector } from 'reselect'
import { activeWalletSelector } from 'selectors/wallet'

export const balanceByIdSelector = (state: RootState) => state.balance.byId

export const activeWalletBalanceSelector = createSelector(
  activeWalletSelector,
  balanceByIdSelector,
  (activeWallet: string, balanceById: any) => activeWallet && (balanceById[`${activeWallet.chain}/${activeWallet.address}`] || ({ balance: '0', symbol: activeWallet.symbol, precision: activeWallet.chain === 'EOS' ? 4 : 8, contract: activeWallet.chain === 'EOS' ? 'eosio.token' : null }))
)
