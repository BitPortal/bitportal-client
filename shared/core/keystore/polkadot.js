import { cryptoWaitReady, base64Decode } from '@polkadot/util-crypto'
import Keyring, { decodeAddress, encodeAddress } from '@polkadot/keyring'
import createPair from '@polkadot/keyring/pair'
import { hexToU8a, isHex } from '@polkadot/util'
import { SS58FORMAT_PREFIX, IS_MAINNET } from 'constants/env'
import { randomUUID, validatePolkadotKeystore, createCrypto, deriveEncPair, clearCachedDerivedKey } from '../utils'
import { randomBytes } from '../crypto'

export const substrateNetwork = {
  substrate: 'substrate',
  polkadot: 'polkadot',
  kusama: 'kusama',
  edgeware: 'edgeware',
  rio: 'rio'
}
console.log('SS58FORMAT_PREFIX', SS58FORMAT_PREFIX)
console.log('isTestNet', !IS_MAINNET)
export const substrateSS58Format = {
  [substrateNetwork.substrate]: 42,
  [substrateNetwork.polkadot]: 0,
  [substrateNetwork.kusama]: 2,
  [substrateNetwork.rio]: SS58FORMAT_PREFIX
}

let keyring

const getKeyring = async (network) => {
  console.log('network', network)
  await cryptoWaitReady()

  if (!keyring) {
    keyring = new Keyring()
  }

  const prefix = network ? substrateSS58Format[substrateNetwork[network]] : null
  if (prefix) keyring.setSS58Format(prefix)

  return keyring
}

export const createPolkadotKeystoreBySuri = async (value, password, options = {}) => {
  // validateBip39Mnemonics(value)

  const { derivePath, network, keyPairType, ...meta } = options

  const path = value + (derivePath || '')

  const keyring = await getKeyring(network)
  const pair = keyring.createFromUri(path, meta, keyPairType)
  const json = pair.toJson(password)

  const secret = Buffer.from(await randomBytes(16)).toString('hex')
  let crypto = await createCrypto(password, secret, 'scrypt', true)
  const encSuri = await deriveEncPair(password, Buffer.from(value, 'utf8').toString('hex'), crypto)
  crypto = clearCachedDerivedKey(crypto)

  const keystore = {
    version: 1,
    ...json,
    id: await randomUUID(),
    encSuri,
    crypto,
    meta: {
      timestamp: +Date.now(),
      chain: 'polkadot',
      name: 'Polka-Wallet',
      network,
      source: 'suri',
      ...meta
    }
  }

  return keystore
}

export const createPolkadotKeystoreByKeystore = async (value, password, options = {}) => {
  validatePolkadotKeystore(value)

  const { network, keyPairType, ...meta } = options
  const keyring = await getKeyring(network)
  const cryptoType = value.encoding.version === '0' || !Array.isArray(value.encoding.content) ? 'ed25519' : value.encoding.content[1];
  const encType = !Array.isArray(value.encoding.type) ? [value.encoding.type] : value.encoding.type;
  const pair = createPair({ type: cryptoType, toSS58: keyring.encodeAddress }, { publicKey: keyring.decodeAddress(value.address, true) }, value.meta, isHex(value.encoded) ? hexToU8a(value.encoded) : base64Decode(value.encoded), encType)
  pair.decodePkcs8(password)
  const json = pair.toJson(password)

  const keystore = {
    version: 1,
    ...json,
    id: await randomUUID(),
    meta: {
      ...meta,
      timestamp: +Date.now(),
      chain: 'polkadot',
      name: 'Polka-Wallet',
      source: 'keystore',
      network,
      ...value.meta
    }
  }

  return keystore
}

export const verifyPolkadotPassword = async (keystore, password) => {
  validatePolkadotKeystore(keystore)

  const network = keystore.meta.network
  const keyring = await getKeyring(network)
  const cryptoType = keystore.encoding.version === '0' || !Array.isArray(keystore.encoding.content) ? 'ed25519' : keystore.encoding.content[1];
  const encType = !Array.isArray(keystore.encoding.type) ? [keystore.encoding.type] : keystore.encoding.type;
  const pair = createPair({ type: cryptoType, toSS58: keyring.encodeAddress }, { publicKey: keyring.decodeAddress(keystore.address, true) }, keystore.meta, isHex(keystore.encoded) ? hexToU8a(keystore.encoded) : base64Decode(keystore.encoded), encType)
  pair.decodePkcs8(password)

  return true
}

export const exportPolkadotKeystore = async (keystore, password) => {
  await verifyPolkadotPassword(keystore, password)

  return {
    address: keystore.address,
    encoded: keystore.encoded,
    encoding: keystore.encoding,
    meta: {
      name: keystore.meta.name,
      tags: keystore.meta.tags,
      whenCreated: keystore.meta.whenCreated,
      whenEdited: keystore.meta.whenEdited,
      genesisHash: keystore.meta.genesisHash
    }
  }
}

export const exportPolkadotKeyPair = async (keystore, password) => {
  validatePolkadotKeystore(keystore)

  const network = keystore.meta.network
  const keyring = await getKeyring(network)
  const cryptoType = keystore.encoding.version === '0' || !Array.isArray(keystore.encoding.content) ? 'ed25519' : keystore.encoding.content[1];
  const encType = !Array.isArray(keystore.encoding.type) ? [keystore.encoding.type] : keystore.encoding.type;
  const pair = createPair({ type: cryptoType, toSS58: keyring.encodeAddress }, { publicKey: keyring.decodeAddress(keystore.address, true) }, keystore.meta, isHex(keystore.encoded) ? hexToU8a(keystore.encoded) : base64Decode(keystore.encoded), encType)
  pair.decodePkcs8(password)

  return pair
}

export const changePolkadotAddressFormat = async (address, network) => {
  let keyring = await getKeyring()
  const publicKey = keyring.decodeAddress(address, true)
  keyring = await getKeyring(network)
  const newAddress = keyring.encodeAddress(publicKey)

  return newAddress
}

export const changePolkadotNetwork = async (keystore, network) => {
  validatePolkadotKeystore(keystore)

  const oldNetwork = keystore.meta.network
  let keyring = await getKeyring(oldNetwork)
  const publicKey = keyring.decodeAddress(keystore.address, true)
  keyring = await getKeyring(network)
  const newAddress = keyring.encodeAddress(publicKey)

  return {
    ...keystore,
    address: newAddress,
    meta: {
      ...keystore.meta,
      network
    }
  }
}

export const validatePolkadotAddress = (address) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
    return true
  } catch (error) {
    return false
  }
}

export const createPolkadotKeystore = async (source, value, password, options) => {
  switch (source) {
    case 'suri':
      return createPolkadotKeystoreBySuri(value, password, options)
    case 'keystore':
      return createPolkadotKeystoreByKeystore(value, password, options)
    default:
      throw new Error(`unsupported source type ${source}`)
  }
}
