declare interface eosAssetParams {}

declare interface eosAsset {
  symbol: string
  account: string
  issuer: string
  current_supply: string
  max_supply: string
  rank_url: string
  createdAt: string
  updatedAt: string
  icon_url?: string
  display_priority: number
  value?: boolean
}

declare type eosAssetResult = eosAsset[]

declare interface eosAssetPref {
  value: boolean
  item: eosAsset[]
}
