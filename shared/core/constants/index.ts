export const bip44Path = {
  eth: `m/44'/60'/0'/0/0`,
  ipfs: `m/44'/99'/0'`,
  btcMainnet: `m/44'/0'/0'`,
  btcTestnet: `m/44'/1'/0'`,
  btcSegwitMainnet: `m/49'/0'/0'`,
  btcSegwitTestnet: `m/49'/1'/0'`,
  eosLedger: `m/44'/194'/0'/0/0`,
  chainx: `m/44'/239'/0'/0/0`
}

export const chain = {
  eth: 'ETHEREUM',
  btc: 'BITCOIN',
  eos: 'EOS',
  chainx: 'CHAINX',
  rioChain:'RIOCHAIN'
}

export const symbol = {
  eth: 'ETH',
  btc: 'BTC',
  eos: 'EOS',
  pcx: 'PCX',
  rioChain:'RIOCHAIN'
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
  eos: 0,
  chainx: 0,
  rioChain: 3,
}

export const magicHex = '0d387e'

export const chainxRpcNodes = [
  'https://w1.chainx.org/rpc',
  'https://w2.chainx.org/rpc'
]

export const eosNodes = [
  'https://eos-mainnet.bitportal.io',
  'https://eos.greymass.com'
]

export const eosTestNodes = [

]

export const ethNodes = [
  'https://mainnet.infura.io/v3/41d3db874b584770865cb0c194f39c47',
]

export const ethTestNodes = [
  'https://ropsten.infura.io/v3/41d3db874b584770865cb0c194f39c47'
]

export const btcNodes = [
  'https://insight.bitpay.com'
]

export const btcTestNodes = [
  'https://test-insight.bitpay.com'
]

export const eosMainnetChainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'

export const eosTestnetChainId = '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'

export const etherscanApiKey = 'EF5MCHMQKH7QEYHEDGY8HNG1NVG5T79BY4'

export const erc20ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "version",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_extraData",
        "type": "bytes"
      }
    ],
    "name": "approveAndCall",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "remaining",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_initialAmount",
        "type": "uint256"
      },
      {
        "name": "_tokenName",
        "type": "string"
      },
      {
        "name": "_decimalUnits",
        "type": "uint8"
      },
      {
        "name": "_tokenSymbol",
        "type": "string"
      }
    ],
    "type": "constructor"
  },
  {
    "payable": false,
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
]
