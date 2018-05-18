declare type bip44Chain = 0 | 1

declare interface BIP44PathParams {
  symbol: string
  account?: number
  chain?: bip44Chain
  address?: number
}
