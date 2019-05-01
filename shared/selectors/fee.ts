import { createSelector } from 'reselect'
import { transferWalletSelector } from 'selectors/wallet'

export const feeSelector = (state: RootState) => state.fee

export const transferWalletFeeSelector = createSelector(
  feeSelector,
  transferWalletSelector,
  (fee: any, wallet: any) => {
    if (!fee || !wallet) return null

    const chain = wallet.chain
    return fee[chain]
  }
)
