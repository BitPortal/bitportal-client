import { createSelector } from 'reselect'
import { activeWalletSelector } from 'selectors/wallet'
import { initialState } from 'reducers/ticker'

export const tickerByIdSelector = (state: RootState) => state.ticker.byId || initialState.byId
export const tickerAllIdsSelector = (state: RootState) => state.ticker.allIds || initialState.allIds
export const tickerSearchTextSelector = (state: RootState) => state.ticker.searchText || initialState.searchText

export const eosRAMPriceSelector = (state: RootState) => state.ticker.resources && state.ticker.resources.byId['EOS/RAM'] && state.ticker.resources.byId['EOS/RAM'].price

export const tickerSelector = createSelector(
  tickerByIdSelector,
  tickerAllIdsSelector,
  tickerSearchTextSelector,
  (byId: any, allIds: any, searchText: string) => {
    if (searchText) {
      return allIds.map(id => byId[id]).filter(item => item.symbol.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 || item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    } else {
      return allIds.map(id => byId[id])
    }
  }
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
