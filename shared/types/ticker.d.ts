declare type Sort = 'quote_volume' | 'base_volume' | 'price_last' | 'price_change' | 'price_change_percent'

declare interface TickerParams {
  limit?: number
  skip?: number
  sort?: Sort
  symbol?: string
  exchange?: string
  market?: string
  base_asset?: string
  quote_asset?: string
}

declare interface Ticker {
  updatedAt: string,
  createdAt: string,
  symbol: string,
  exchange: string,
  market: string,
  symbol_type: string,
  base_asset: string,
  quote_asset: string,
  price_last: number,
  price_high?: number,
  price_low?: number,
  price_ask: number,
  price_bid: number,
  price_change: number,
  price_change_percent: number,
  quote_volume: number,
  base_volume: number
}

declare type TickerResult = Ticker[]
