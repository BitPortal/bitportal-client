import { createSelector } from 'reselect'
import { activeWalletSelector, managingWalletSelector, transferWalletSelector } from 'selectors/wallet'
import { activeAssetSelector, transferAssetSelector } from 'selectors/asset'

export const balanceByIdSelector = (state: RootState) => state.balance.byId

export const activeWalletBalanceSelector = createSelector(
  activeWalletSelector,
  balanceByIdSelector,
  (activeWallet: string, balanceById: any) => {
    if (activeWallet) {
      if (balanceById[`${activeWallet.chain}/${activeWallet.address}`] && balanceById[`${activeWallet.chain}/${activeWallet.address}`].syscoin) {
        return balanceById[`${activeWallet.chain}/${activeWallet.address}`].syscoin
      } else {
        return ({ balance: '0', symbol: activeWallet.symbol, precision: activeWallet.chain === 'EOS' ? 4 : 8, contract: activeWallet.chain === 'EOS' ? 'eosio.token' : null })
      }
    }

    return null
  }
)

export const transferWalletBalanceSelector = createSelector(
  transferWalletSelector,
  balanceByIdSelector,
  (transferWallet: string, balanceById: any) => {
    if (transferWallet) {
      if (balanceById[`${transferWallet.chain}/${transferWallet.address}`]) {
        return balanceById[`${transferWallet.chain}/${transferWallet.address}`].syscoin
      } else {
        return ({ balance: '0', symbol: transferWallet.symbol, precision: transferWallet.chain === 'EOS' ? 4 : 8, contract: transferWallet.chain === 'EOS' ? 'eosio.token' : null })
      }
    }

    return null
  }
)

export const activeAssetBalanceSelector = createSelector(
  activeWalletSelector,
  activeAssetSelector,
  balanceByIdSelector,
  (activeWallet: string, activeAsset: string, balanceById: any) => {
    if (activeWallet && activeAsset) {
      if (balanceById[`${activeWallet.chain}/${activeWallet.address}`] && balanceById[`${activeWallet.chain}/${activeWallet.address}`][`${activeAsset.contract}/${activeAsset.symbol}`]) {
        return balanceById[`${activeWallet.chain}/${activeWallet.address}`][`${activeAsset.contract}/${activeAsset.symbol}`]
      } else {
        return ({ balance: '0', symbol: activeAsset.symbol, precision: activeWallet.chain === 'EOS' ? 4 : 8, contract: activeAsset.contract })
      }
    }

    return null
  }
)

export const transferAssetBalanceSelector = createSelector(
  transferWalletSelector,
  transferAssetSelector,
  balanceByIdSelector,
  (transferWallet: string, transferAsset: string, balanceById: any) => {
    if (transferWallet && transferAsset) {
      if (balanceById[`${transferWallet.chain}/${transferWallet.address}`] && balanceById[`${transferWallet.chain}/${transferWallet.address}`][`${transferAsset.contract}/${transferAsset.symbol}`]) {
        return balanceById[`${transferWallet.chain}/${transferWallet.address}`][`${transferAsset.contract}/${transferAsset.symbol}`]
      } else {
        return ({ balance: '0', symbol: transferAsset.symbol, precision: transferWallet.chain === 'EOS' ? 4 : 8, contract: transferAsset.contract })
      }
    }

    return null
  }
)

export const activeWalletAssetsBalanceSelector = createSelector(
  activeWalletSelector,
  balanceByIdSelector,
  (activeWallet: string, balanceById: any) => activeWallet && balanceById[`${activeWallet.chain}/${activeWallet.address}`]
)

export const managingWalletBalanceSelector = createSelector(
  managingWalletSelector,
  balanceByIdSelector,
  (managingWallet: string, balanceById: any) => managingWallet && (balanceById[`${managingWallet.chain}/${managingWallet.address}`] || ({ balance: '0', symbol: managingWallet.symbol, precision: managingWallet.chain === 'EOS' ? 4 : 8, contract: managingWallet.chain === 'EOS' ? 'eosio.token' : null }))
)
