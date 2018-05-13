declare interface BalanceParams {
  code: string
  account: string
  symbol?: string
}

declare interface GetEOSBalanceResult {
  name: string
  balance: []
}
