export const EXCHANGES = [
  //  'BINANCE',
  "OKEX",
  "BITTREX",
  //  'HUOBIPRO',
  "POLONIEX",
  "GDAX"
];

export const EXCHANGE_NAMES = {
  //  BINANCE: 'Binance',
  GDAX: "GDAX",
  BITTREX: "Bittrex",
  OKEX: "OKEx",
  //  HUOBIPRO: 'Huobi Pro',
  POLONIEX: "Poloniex"
};

export const MARKET_CATEGORIES = [
  { name: "DEXLIZE", login_required: false },
  { name: "OVERVIEW", login_required: false },
  { name: "SYSTEM", login_required: true }
];

export const MARKET_CATEGORY_NAMES = {
  DEXLIZE: "Dexlize",
  OVERVIEW: "Overview",
  SYSTEM: "System Resources"
};

export const QUOTE_ASSETS = {
  //  BINANCE: ['BTC', 'ETH', 'BNB', 'USDT'],
  GDAX: ["BTC", "USD", "EUR", "GBP"],
  BITTREX: ["BTC", "ETH", "USDT"],
  OKEX: ["BTC", "ETH", "USDT"],
  //  HUOBIPRO: ['BTC', 'ETH', 'USDT'],
  POLONIEX: ["BTC", "ETH", "XMR", "USDT"]
};

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
};

export const DEFAULT_USD_RATE = {
  USD: 1,
  CNY: 6.4
};

export const DEFAULT_SORT_FILTER = "market_cap_usd";

export const sort_filters = [
  "market_cap_usd",
  "price_change_percent_low",
  "price_change_percent_high",
  "current_price_low",
  "current_price_high"
];

export const MARKET_DETAIL_KEYS = [
  "market_label_market_cap",
  "blockchain",
  "circulating_supply",
  "total_supply",
  "proof_type",
  "team_location",
  "first_announced",
  "algorithm",
  "block_time",
  "ico_start",
  "ico_end",
  "ico_capital"
];
