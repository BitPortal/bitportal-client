declare interface VoteEOSProducersParams {
  eosAccountName: string
  password: string
  permission: string
  producers: string[]
  proxy: string
}

declare interface TransferEOSAssetParams {
  fromAccount: string
  toAccount: string
  contract: string
  amount: string
  symbol: string
  precision: number
  memo: string
  password: string
  permission: string
}

declare interface PushEOSActionParams {
  account: string
  actions: any
  password: string
  permission: string
}

declare interface SignEOSDataParams {
  account: string
  publicKey: string
  password: string
  signData: string
  isHash: boolean
}