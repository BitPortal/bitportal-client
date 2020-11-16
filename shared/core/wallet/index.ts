import assert from 'assert'
import {bip39, randomBytes} from 'core/crypto'
import {
  createIdentityKeystore,
  createHDBTCKeystore,
  createBTCKeystore,
  createHDETHKeystore,
  createHDEOSKeystore,
  createHDChainxKeystore,
  importETHKeystore,
  createETHKeystore,
  createEOSKeystore,
  createChainxKeystore,
  decryptMnemonic,
  decryptPrivateKey,
  decryptPrivateKeys,
  verifyPassword as verifyPasswordKeystore
} from 'core/keystore'
import {source, network as networkType} from 'core/constants'
import uuidv4 from 'uuid/v4'
import bs58check from 'bs58check'
import {
  createPolkadotKeystoreBySuri,
  createPolkadotKeystoreByKeystore
} from 'core/keystore/polkadot'

export const createIdentity = async (password: string, name: string, passwordHint: string, network: string, isSegWit: boolean) => {
  assert(network === networkType.mainnet || network === networkType.testnet, 'Invalid network')

  const mnemonicText = await bip39.generateMnemonic()
  const mnemonicCodes = mnemonicText.trim().split(' ')
  const metadata = {
    name,
    passwordHint,
    network,
    source: source.newIdentity
  }

  const keystore = await createIdentityKeystore(metadata, mnemonicCodes, password)

  const btcWalletKeystore = await createHDBTCKeystore(metadata, mnemonicCodes, password, isSegWit)
  const ethWalletKeystore = await createHDETHKeystore(metadata, mnemonicCodes, password)
  const polkadotWalletKeystore = await createPolkadotKeystoreBySuri(mnemonicCodes, password, metadata)
  // TODO 屏蔽 EOS ～xbc
  // const eosWalletKeystore = await createHDEOSKeystore(metadata, mnemonicCodes, password)
  // TODO 屏蔽 chainx ～xbc
  // const chainxWalletKeyStore = await createHDChainxKeystore(metadata, mnemonicCodes, password)

  // const wallets = [btcWalletKeystore, ethWalletKeystore, eosWalletKeystore, chainxWalletKeyStore]
  const wallets = [btcWalletKeystore, ethWalletKeystore]
  keystore.walletIDs.push(btcWalletKeystore.id)
  keystore.walletIDs.push(ethWalletKeystore.id)
  // keystore.walletIDs.push(eosWalletKeystore.id)
  // keystore.walletIDs.push(chainxWalletKeyStore.id)

  return {keystore, wallets}
}

export const recoverIdentity = async (mnemonic: string, password: string, name: string, passwordHint: string, network: string, isSegWit: boolean) => {
  assert(network === networkType.mainnet || network === networkType.testnet, 'Invalid network')

  const mnemonicText = mnemonic
  const mnemonicCodes = mnemonicText.trim().split(' ')
  const metadata = {
    name,
    passwordHint,
    network,
    source: source.recoveredIdentity
  }

  const keystore = await createIdentityKeystore(metadata, mnemonicCodes, password)

  const btcWalletKeystore = await createHDBTCKeystore(metadata, mnemonicCodes, password, isSegWit)
  const ethWalletKeystore = await createHDETHKeystore(metadata, mnemonicCodes, password)
  const polkadotWalletKeystore = await createPolkadotKeystoreBySuri(mnemonicCodes, password, metadata)
  // TODO 屏蔽EOS chainX ～xbc
  // const eosWalletKeystore = await createHDEOSKeystore(metadata, mnemonicCodes, password)
  // const chainxWalletKeyStore = await createHDChainxKeystore(metadata, mnemonicCodes, password)

  // const wallets = [btcWalletKeystore, ethWalletKeystore, eosWalletKeystore, chainxWalletKeyStore]
  const wallets = [btcWalletKeystore, ethWalletKeystore]
  keystore.walletIDs.push(btcWalletKeystore.id)
  keystore.walletIDs.push(ethWalletKeystore.id)
  // keystore.walletIDs.push(eosWalletKeystore.id)
  // keystore.walletIDs.push(chainxWalletKeyStore.id)

  return {keystore, wallets}
}

export const exportMnemonic = async (password: string, keystore: any) => {
  const mnemonics = await decryptMnemonic(password, keystore)
  return mnemonics
}

export const exportPrivateKey = async (password: string, keystore: any, source?: string) => {
  const privateKey = await decryptPrivateKey(password, keystore)
  if (source === 'WIF') {
    return Buffer.from(privateKey, 'hex').toString()
  } else {
    return privateKey
  }
}

export const exportPrivateKeys = async (password: string, keystore: any) => {
  const keyPairs = await decryptPrivateKeys(password, keystore)
  return keyPairs
}

export const importBTCWalletByMnemonics = async (mnemonic: string, password: string, name: string, passwordHint: string, network: string, isSegWit: boolean) => {
  assert(network === networkType.mainnet || network === networkType.testnet, 'Invalid network')

  const mnemonicText = mnemonic
  const mnemonicCodes = mnemonicText.trim().split(' ')
  const metadata = {
    name,
    passwordHint,
    network,
    source: source.mnemonic
  }

  const btcWalletKeystore = await createHDBTCKeystore(metadata, mnemonicCodes, password, isSegWit)

  return btcWalletKeystore
}

export const importBTCWalletByPrivateKey = async (wif: string, password: string, name: string, passwordHint: string, network: string, isSegWit: boolean) => {
  assert(network === networkType.mainnet || network === networkType.testnet, 'Invalid network')

  const metadata = {
    name,
    passwordHint,
    network,
    source: source.wif
  }

  const btcWalletKeystore = await createBTCKeystore(metadata, wif, password, isSegWit)

  return btcWalletKeystore
}

export const importETHWalletByKeystore = async (keystore: any, password: string, name: string, passwordHint: string) => {
  const metadata = {
    name,
    passwordHint,
    source: source.keystore
  }

  const ethWalletKeystore = await importETHKeystore(metadata, keystore, password)

  return ethWalletKeystore
}

export const importETHWalletByPrivateKey = async (privateKey: string, password: string, name: string, passwordHint: string) => {
  const metadata = {
    name,
    passwordHint,
    source: source.privateKey
  }

  const ethWalletKeystore = await createETHKeystore(metadata, privateKey, password)

  return ethWalletKeystore
}

export const importETHWalletByMnemonics = async (mnemonic: string, password: string, name: string, passwordHint: string, mnemonicPath?: string) => {
  const mnemonicText = mnemonic
  const mnemonicCodes = mnemonicText.trim().split(' ')
  const metadata = {
    name,
    passwordHint,
    source: source.mnemonic
  }

  const ethWalletKeystore = await createHDETHKeystore(metadata, mnemonicCodes, password, mnemonicPath)

  return ethWalletKeystore
}

export const importEOSWalletByPrivateKeys = async (wifs: any, password: string, name: string, passwordHint: string, accountName: string) => {
  const metadata = {
    name,
    passwordHint,
    source: source.wif
  }

  const eosWalletKeystore = await createEOSKeystore(metadata, wifs, password, accountName)

  return eosWalletKeystore
}

export const importEOSWalletsByPrivateKeys = async (wifs: any, password: string, name: string, passwordHint: string, accountNames: any) => {
  const eosWalletKeystore = await importEOSWalletByPrivateKeys(wifs, password, name, passwordHint)

  const eosWalletKeystores = await Promise.all(accountNames.map(async (accountName: string) => {
    const random = await randomBytes(16)
    return {...eosWalletKeystore, id: uuidv4({random}), address: accountName}
  }))

  return eosWalletKeystores
}

export const verifyPassword = verifyPasswordKeystore

export const getIdentityMetaData = (keystore: any) => ({
  id: keystore.id,
  identifier: keystore.identifier,
  ipfsId: keystore.ipfsId,
  walletIDs: keystore.walletIDs,
  version: keystore.version,
  ...keystore.bitportalMeta
})

export const getWalletMetaData = (keystore: any) => {
  const metadata = keystore.bitportalMeta
  const keyPathPrivates = keystore.keyPathPrivates

  const info = {
    version: keystore.version,
    id: keystore.id,
    address: keystore.address,
    ...metadata
  }

  if (keyPathPrivates) {
    const publicKeys = keyPathPrivates.map((item: any) => item.publicKey)
    info.publicKeys = publicKeys
  }

  return info
}


export const importChainxWalletByMnemonics = async (mnemonic: string, password: string, name: string, passwordHint: string, network: string) => {
  assert(network === networkType.mainnet || network === networkType.testnet, 'Invalid network')

  const mnemonicText = mnemonic
  const mnemonicCodes = mnemonicText.trim().split(' ')
  const metadata = {
    name,
    passwordHint,
    network,
    source: source.mnemonic
  }

  const chainxWalletKeystore = await createHDChainxKeystore(metadata, mnemonicCodes, password)

  return chainxWalletKeystore
}

export const importChainxWalletByPrivateKey = async (wif: string, password: string, name: string, passwordHint: string, network: string) => {
  assert(network === networkType.mainnet || network === networkType.testnet, 'Invalid network')

  const metadata = {
    name,
    passwordHint,
    network,
    source: source.wif
  }

  const chainxWalletKeystore = await createChainxKeystore(metadata, wif, password)

  return chainxWalletKeystore
}

export const importPolkadotWalletByKeystore = async (keystore, password, name, passwordHint, network, polkadotNetwork, keyPairType) => {
  assert(network === networkType.mainnet || network === networkType.testnet, 'Invalid network')

  const metadata = {
    name,
    passwordHint,
    network,
    source: source.keystore,
    polkadotNetwork: polkadotNetwork || 'rio',
    keyPairType: keyPairType || 'sr25519'
  }

  return createPolkadotKeystoreByKeystore(keystore, password, metadata)
}

export const importPolkadotWalletBySuri = async (suri, password, name, passwordHint, network, polkadotNetwork, keyPairType) => {
  assert(network === networkType.mainnet || network === networkType.testnet, 'Invalid network')

  const metadata = {
    name,
    passwordHint,
    network,
    source: source.suri,
    polkadotNetwork: polkadotNetwork || 'rio',
    keyPairType: keyPairType || 'sr25519'
  }

  return createPolkadotKeystoreBySuri(suri, password, metadata)
}
