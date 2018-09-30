declare interface ImportKeyParams {
  hdWalletName: string
  key: string
  coin: string
}

declare interface ImportKeyResult {
  publicKey: string
  coin: string
  walletId: string
}
