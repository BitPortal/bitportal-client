declare interface BIP32Path {
  purpose?: number
  coin_type: number
  account: number
  change: number
  address_index: number
}
