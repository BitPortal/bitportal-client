declare interface GetEOSAssetParams {}

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

declare type GetEOSAssetResult = eosAsset[]

declare interface SaveEOSAssetPref {
  value: boolean
  symbol: string
  eosAccountName: string
}

declare interface GetEOSAssetPrefParams {
  eosAccountName: string
}



declare type GetEOSAssetPrefResult = SaveEOSAssetPref[]
