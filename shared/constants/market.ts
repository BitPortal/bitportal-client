export const EXCHANGES = [
  'BINANCE',
  'BITTREX',
  'OKEX',
  'HUOBIPRO',
  'POLONIEX',
  'GDAX'
]

export const EXCHANGE_NAMES = {
  BINANCE: 'Binance',
  GDAX: 'GDAX',
  BITTREX: 'Bittrex',
  OKEX: 'OKEx',
  HUOBIPRO: 'Huobi Pro',
  POLONIEX: 'Poloniex'
}

export const QUOTE_ASSETS = {
  BINANCE: ['BTC', 'ETH', 'BNB', 'USDT'],
  GDAX: ['BTC', 'USD', 'EUR', 'GBP'],
  BITTREX: ['BTC', 'ETH', 'USDT'],
  OKEX: ['BTC', 'ETH', 'USDT'],
  HUOBIPRO: ['BTC', 'ETH', 'USDT'],
  POLONIEX: ['BTC', 'ETH', 'XMR', 'USDT']
}

export const ASSET_FRACTION = {
  BTC: 8,
  ETH: 8,
  XMR: 8,
  BNB: 5,
  USDT: 2,
  USD: 2,
  EUR: 2,
  GBP: 2,
  EOS: 4
}

export const DEFAULT_USD_RATE = {
  USD: 1,
  CNY: 6.4
}

export const DEFAULT_SORT_FILTER = 'quote_volume'

const sort_filters = [
  'quote_volume',
  'price_change_percent_low',
  'price_change_percent_high',
  'current_price_low',
  'current_price_high'
]
