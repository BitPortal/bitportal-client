import { createSelector } from 'reselect'
import { activeWalletSelector, managingWalletSelector, transferWalletSelector } from 'selectors/wallet'
import { activeAssetSelector, transferAssetSelector } from 'selectors/asset'

export const balanceByIdSelector = (state: RootState) => state.balance.byId

export const activeWalletBalanceSelector = createSelector(
  activeWalletSelector,
  balanceByIdSelector,
  (activeWallet: string, balanceById: any) => {
    if (activeWallet) {
      return (balanceById[`${activeWallet.chain}/${activeWallet.address}`] || ({ balance: '0', symbol: activeWallet.symbol, precision: activeWallet.chain === 'EOS' ? 4 : 8, contract: activeWallet.chain === 'EOS' ? 'eosio.token' : null }))
    }

    return null
  }
)

export const activeWalletAssetBalanceSelector = createSelector(
  activeWalletSelector,
  activeAssetSelector,
  balanceByIdSelector,
  (activeWallet: string, activeAsset: string, balanceById: any) => {
    if (activeWallet && activeAsset) {
      return (balanceById[`${activeWallet.chain}/${activeWallet.address}/${activeAsset.contract}/${activeAsset.symbol}`] || ({ balance: '0', symbol: activeAsset.symbol, precision: (activeAsset.decimals > 8 ? 8 : activeAsset.decimals), contract: activeAsset.contract }))
    }

    return null
  }
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

export const transferWalletAssetBalanceSelector = createSelector(
  transferWalletSelector,
  transferAssetSelector,
  balanceByIdSelector,
  (transferWallet: string, transferAsset: string, balanceById: any) => {
    if (transferWallet && transferAsset) {
      return (balanceById[`${transferWallet.chain}/${transferWallet.address}/${transferAsset.contract}/${transferAsset.symbol}`] || ({ balance: '0', symbol: transferAsset.symbol, precision: (transferAsset.decimals > 8 ? 8 : transferAsset.decimals), contract: transferAsset.contract }))
    }

    return null
  }
)
