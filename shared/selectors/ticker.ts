import { createSelector } from 'reselect'
import { activeWalletSelector } from 'selectors/wallet'

export const tickerByIdSelector = (state: RootState) => state.ticker.byId
export const tickerAllIdsSelector = (state: RootState) => state.ticker.allIds

export const tickerSelector = createSelector(
  tickerByIdSelector,
  tickerAllIdsSelector,
  (byId: any, allIds: any) => allIds.map(id => byId[id])
)

export const activeWalletTickerSelector = createSelector(
  activeWalletSelector,
  tickerByIdSelector,
  (activeWallet: any, byId: any) => {
    tickers = {}

    if (activeWallet && byId && byId[`${activeWallet.chain}/${activeWallet.symbol}`] && byId[`${activeWallet.chain}/${activeWallet.symbol}`].price_usd) {
      tickers[`${activeWallet.chain}/${activeWallet.symbol}`] = byId[`${activeWallet.chain}/${activeWallet.symbol}`].price_usd
      return tickers
    }

    return null
  }
)
