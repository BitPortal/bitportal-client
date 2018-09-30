declare interface TokenParams {
  name_en?: string
  symbol?: string
  name_zh?: string
}

declare interface Token {
  updatedAt: string
  createdAt: string
  symbol: string
  name_en: string
  circulating_supply?: number
  total_supply?: number
  tags?: object
  description?: object
  first_announced?: string
  platform?: string
  proof_type?: string
  market_token_detail_label_24h_volumn?: string
  market_label_market_cap?: string
  blockchain?: string
  team_location?: string
  algorithm?: string
  block_time?: string
  ico_start?: string
  ico_end?: string
  ico_capital?: string
}

declare type TokenResult = Token[]
