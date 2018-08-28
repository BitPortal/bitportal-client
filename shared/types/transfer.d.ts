declare interface TransferParams {
  password: string
  fromAccount: string
  toAccount: string
  quantity: string
  symbol: string
  contract: string
  memo?: string
  componentId?: string
}

declare type TransferResult = any
