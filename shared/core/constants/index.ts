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

export const symbol = {
  eth: 'ETH',
  btc: 'BTC',
  eos: 'EOS'
}

export const walletType = {
  hd: 'HD',
  random: 'RANDOM',
  v3: 'V3',
  hdSha256: 'HD_SHA256',
  pathDirectly: 'PATH_DIRECTLY',
  imported: 'IMPORTED'
}

export const derivedMode = {
  hdSha256: 'HD_SHA256',
  pathDirectly: 'PATH_DIRECTLY',
  imported: 'IMPORTED'
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
  eth: 3,
  eos: 0
}

export const magicHex = '0d387e'

export const eosNodes = [
  'https://eos-mainnet.bitportal.io',
  'https://geo.eosasia.one',
  'https://api1.eosasia.one',
  'https://eos.greymass.com',
  'https://api.hkeos.com'
]

export const ethNodes = [
  'https://mainnet.infura.io'
]

export const btcNodes = [
  'https://insight.bitpay.com'
]

export const eosMainnetChainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'

export const eosTestnetChainId = '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'

const etherscanApiKey = 'J69V6CD69KQ72123TF6BA1ZTWKY13A197X'
