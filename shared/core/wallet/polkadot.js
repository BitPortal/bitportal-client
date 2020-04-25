import assert from 'assert'
import { secureStorage } from '@terencege/storage'
import {
  createKeystore,
  decryptMnemonics,
  decryptPrivateKey,
  decryptPrivateKeys,
  exportKeystore as exportOfficialKeystore,
  verifyPassword as verifyKeystorePassword,
  decryptKeyPair,
  changeKeystoreNetwork
} from '../keystore'

export const scanWallets = async () => {
  const wallets = await secureStorage.getAll()
  return Object.values(wallets).map(item => JSON.parse(item)).map(item => ({
    id: item.id,
    address: item.address,
    ...item.meta
  }))
}

export const importWallet = async (chain, source, value, password, options = {}) => {
  const keystore = await createKeystore(chain, source, value, password, options)
  await secureStorage.setItem(`wallet_${keystore.id}`, keystore, true)
  return await getWallet(keystore.id)
}

export const getWallet = async (walletId) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)

  return {
    id: keystore.id,
    address: keystore.address,
    ...keystore.meta
  }
}

export const deleteWallet = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  await verifyKeystorePassword(keystore, password)
  await secureStorage.removeItem(`wallet_${walletId}`)
}

export const exportMnemonics = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  const mnemonics = await decryptMnemonics(keystore, password)
  return mnemonics
}

export const exportPrivateKey = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  const privateKey = await decryptPrivateKey(keystore, password)
  return privateKey
}

export const exportPrivateKeys = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  const privateKeys = await decryptPrivateKeys(keystore, password)
  return privateKeys
}

export const exportKeyPair = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  const keyPair = await decryptKeyPair(keystore, password)
  return keyPair
}

export const exportKeystore = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  const officialKeystore = await exportOfficialKeystore(keystore, password)
  return officialKeystore
}

export const verifyPassword = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  await verifyKeystorePassword(keystore, password)
}

export const changeWalletName = async (walletId, name) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)

  keystore.name = name
  await secureStorage.setItem(`wallet_${walletId}`, keystore, true)
  return await getWallet(keystore.id)
}

export const changeWalletNetwork = async (walletId, network) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)

  const newKeystore = await changeKeystoreNetwork(keystore, network)
  await secureStorage.setItem(`wallet_${walletId}`, newKeystore, true)
  return await getWallet(newKeystore.id)
}
