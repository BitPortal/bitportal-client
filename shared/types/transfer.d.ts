declare interface TransferParams {
  password: string
  fromAccount: string
  toAccount: string
  quantity: string
  symbol: string
  contract: string
  memo?: string
  precision?: number
  permission?: string
  componentId?: string
  callback?: string
}

declare type TransferResult = any
