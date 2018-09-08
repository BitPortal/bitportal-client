declare interface TransactionsParams {
  eosAccountName: string
  position: number
  offset: number
}

declare interface TransactionsResult {
  hasMore: boolean
  position: number
  actions: any
  lastIrreversibleBlock: number
  activeAssetIncrements: number
}

declare interface TransactionDetailParams {
  id: string
}

declare interface TransactionDetailResult {

}
