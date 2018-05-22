declare interface CreateWalletParams {
  name: string
}

declare interface CreateWalletResult {
  name: string
  id: string
}

declare interface HDWallet {
  id: string
  name: string
}

declare interface SyncWalletResult {
  wallets: HDWallet[]
  active: HDWallet
}
