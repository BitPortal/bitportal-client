import Immutable from 'immutable'
import { DEFAULT_USD_RATE } from 'constants/market'

export const getInitialCurrency = (presetCurrencySymbol?: string, presetCurrencyRate?: string) => {
  const symbol = presetCurrencySymbol || 'USD'

  return Immutable.fromJS({
    rate: presetCurrencyRate || DEFAULT_USD_RATE[symbol],
    symbol
  })
}
