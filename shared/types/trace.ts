
declare interface TraceTransactionParams {
  userId?: any
  walletId?: string
  assetType?: string
  toAddr?: string
  amount?: any
}


declare interface TraceStakeParams {
  userId?: any
  walletId?: string
  type?: string
  assetType?: string
  amount?: any
}

declare interface TraceVotesParams {
  userId?: any
  walletId?: string
  bpList: any[]
  amount?: any
}
