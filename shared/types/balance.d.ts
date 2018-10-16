declare interface GetEOSBalanceParams {
  eosAccountName: string
}

declare interface GetEOSBalanceResult {
  eosAccountName: string
  balanceInfo: any
}

declare interface GetAssetBalanceParams {
  eosAccountName: string
  code: string
}

declare interface GetAssetBalanceResult {
  eosAccountName: string
  balanceInfo: any
}

declare interface GetAssetBalanceListParams {
  eosAccountName: string
}

declare interface GetAssetBalanceListResult {
  eosAccountName: string
  balanceInfo: any
}
