import { createSelector } from 'reselect'
import { activeWalletSelector, managingWalletSelector, transferWalletSelector } from 'selectors/wallet'

export const balanceByIdSelector = (state: RootState) => state.balance.byId

export const activeWalletBalanceSelector = createSelector(
  activeWalletSelector,
  balanceByIdSelector,
  (activeWallet: string, balanceById: any) => activeWallet && (balanceById[`${activeWallet.chain}/${activeWallet.address}`] || ({ balance: '0', symbol: activeWallet.symbol, precision: activeWallet.chain === 'EOS' ? 4 : 8, contract: activeWallet.chain === 'EOS' ? 'eosio.token' : null }))
)

export const managingWalletBalanceSelector = createSelector(
  managingWalletSelector,
  balanceByIdSelector,
  (managingWallet: string, balanceById: any) => managingWallet && (balanceById[`${managingWallet.chain}/${managingWallet.address}`] || ({ balance: '0', symbol: managingWallet.symbol, precision: managingWallet.chain === 'EOS' ? 4 : 8, contract: managingWallet.chain === 'EOS' ? 'eosio.token' : null }))
)

export const transferWalletBalanceSelector = createSelector(
  transferWalletSelector,
  balanceByIdSelector,
  (transferWallet: string, balanceById: any) => transferWallet && (balanceById[`${transferWallet.chain}/${transferWallet.address}`] || ({ balance: '0', symbol: transferWallet.symbol, precision: transferWallet.chain === 'EOS' ? 4 : 8, contract: transferWallet.chain === 'EOS' ? 'eosio.token' : null }))
)
