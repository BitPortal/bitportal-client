export const bip44Path = {
  eth: `m/44'/60'/0'/0/0`,
  ipfs: `m/44'/99'/0'`,
  btcMainnet: `m/44'/0'/0'`,
  btcTestnet: `m/44'/1'/0'`,
  btcSegwitMainnet: `m/49'/0'/0'`,
  btcSegwitTestnet: `m/49'/1'/0'`,
  eosLedger: `m/44'/194'/0'/0/0`
}

export const chain = {
  eth: 'ETHEREUM',
  btc: 'BITCOIN',
  eos: 'EOS'
}

export const walletType = {
  hd: 'HD',
  random: 'RANDOM',
  v3: 'V3',
  hdSha256: 'HD_SHA256',
  pathDirectly: 'PATH_DIRECTLY'
}

export const derivedMode = {
  hdSha256: 'HD_SHA256',
  pathDirectly: 'PATH_DIRECTLY'
}

export const network = {
  mainnet: 'MAINNET',
  testnet: 'TESTNET'
}

export const segWit = {
  none: 'NONE',
  p2wpkh: 'P2WPKH'
}

export const source = {
  newIdentity: 'NEW_IDENTITY',
  recoveredIdentity: 'RECOVERED_IDENTITY',
  privateKey: 'PRIVATE',
  wif: 'WIF',
  keystore: 'KEYSTORE',
  mnemonic: 'MNEMONIC'
}

export const mode = {
  normal: 'NORMAL',
  offline: 'OFFLINE',
  hardware: 'HARDWARE'
}

export const keystoreVersion = {
  identity: 0,
  btc: 0,
  eth: 0,
  eos: 0
}

export const magicHex = '0d387e'
