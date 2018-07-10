declare interface ImportEOSKeyParams {
  walletId: string
  password: string
  key: string
  hdWalletName: string
}

declare interface ExportEOSKeyParams {
  origin: string
  bpid: string
  eosAccountName: string
  password: string
  componentId?: string
}

declare interface ExportKeyResult {

}
