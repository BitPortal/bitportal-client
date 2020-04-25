import { cryptoWaitReady } from '@polkadot/util-crypto'
import Keyring from '@polkadot/keyring'
import createPair from '@polkadot/keyring/pair'
import { hexToU8a } from '@polkadot/util'
import { randomUUID, validateBip39Mnemonics, validatePolkadotKeystore } from '../utils'

export const substrateNetwork = {
  substrate: 'substrate',
  polkadot: 'polkadot',
  kusama: 'kusama',
  edgeware: 'edgeware',
  rio: 'rio'
}

export const substrateSS58Format = {
  [substrateNetwork.substrate]: 42,
  [substrateNetwork.polkadot]: 0,
  [substrateNetwork.kusama]: 2
}

let keyring

const getKeyring = async (network) => {
  await cryptoWaitReady()

  if (!keyring) {
    keyring = new Keyring()
  }

  const prefix = network ? substrateSS58Format[substrateNetwork[network]] : null
  if (prefix) keyring.setSS58Format(prefix)

  return keyring
}

export const createPolkadotKeystoreBySuri = async (value, password, options = {}) => {
  validateBip39Mnemonics(value)

  const { derivePath, network, keyPairType, ...meta } = options

  const path = value + (derivePath || '')

  const keyring = await getKeyring(network)
  const pair = keyring.createFromUri(path, meta, keyPairType)
  const json = pair.toJson(password)

  const keystore = {
    version: 1,
    ...json,
    id: await randomUUID(),
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
  const type = Array.isArray(value.encoding.content) ? value.encoding.content[1] : 'ed25519'
  const pair = createPair(type, { publicKey: keyring.decodeAddress(value.address, true) }, value.meta, hexToU8a(value.encoded))
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
  const type = Array.isArray(keystore.encoding.content) ? keystore.encoding.content[1] : 'ed25519'
  const pair = createPair(type, { publicKey: keyring.decodeAddress(keystore.address, true) }, keystore.meta, hexToU8a(keystore.encoded))
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
  const type = Array.isArray(keystore.encoding.content) ? keystore.encoding.content[1] : 'ed25519'
  const pair = createPair(type, { publicKey: keyring.decodeAddress(keystore.address, true) }, keystore.meta, hexToU8a(keystore.encoded))
  pair.decodePkcs8(password)

  return pair
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
