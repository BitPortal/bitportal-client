declare interface CreateWalletParams {
  password: string
  name: string
}

declare interface CreateWalletResult {
  name?: string
  bpid?: string
  origin: string
  timestamp: number
}

declare interface HDWallet {
  id: string
  name: string
}

declare interface ClassicWallet {
  name: string
}

declare interface SyncWalletResult {
  hdWalletList: HDWallet[]
  classicWalletList: ClassicWallet[]
  active: ClassicWallet | HDWallet
}

declare interface LogoutParams {
  eosAccountName: string
  password: string
  origin: string
  bpid?: string
  coin: string
  componentId?: string,
  permission?: string,
  publicKey?: string
}

declare interface ChangePasswordParams {

}

declare interface ImportWalletParams {

}

declare interface ImportWalletResult {

}

declare interface CreateWalletAndEOSAccountParams {
  origin: string
  name: string
  password: string
  eosAccountName: string
  componentId?: string
}
