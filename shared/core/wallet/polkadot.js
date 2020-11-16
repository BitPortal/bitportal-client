// import uuidv1 from 'uuid/v1'
import assert from 'assert'
import { secureStorage } from 'storage'
import { u8aToHex } from 'utils/u8a'
import { stringToU8a } from 'utils/string'
import {
  createKeystore,
  exportKeystore as exportOfficialKeystore,
  verifyPassword as verifyKeystorePassword,
  decryptKeyPair,
  changeKeystoreNetwork,
  changeAddressFormat
} from './keystore'
import { decryptEncPair } from './utils'

export const scanExtensionWallets = async () => {
  const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp'/* webpackChunkName: 'extension-dapp' */)

  await web3Enable('rio')
  const allAccounts = await web3Accounts()
  const polkadotExtensionWallets = await Promise.all(
    allAccounts
      .filter(wallet => wallet.meta.source === 'polkadot-js')
      .map(async wallet => ({
        id: wallet.address,
        address: await changeAddressFormat(wallet.address, 'rio', 'polkadot'),
        name: wallet.meta.name,
        chain: 'polkadot',
        source: 'extension',
        network: 'rio',
        timestamp: +Date.now()
      }))
  )

  return polkadotExtensionWallets
}

export const getWallet = async (walletId) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)
  const newKeystore = await changeKeystoreNetwork(keystore, 'rio')

  return {
    id: keystore.id,
    address: newKeystore.address,
    ...newKeystore.meta
  }
}

export const scanWallets = async () => {
  const storageKeys = await secureStorage.getAllKeys()
  return Promise.all(storageKeys.filter(key => key.indexOf('wallet_') === 0).map(key => getWallet(key.slice('wallet_'.length))))
}

export const importWallet = async (chain, source, value, password, options = {}) => {
  const keystore = await createKeystore(chain, source, value, password, options)
  await secureStorage.setItem(`wallet_${keystore.id}`, keystore, true)
  return getWallet(keystore.id)
}

export const deleteWallet = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  await verifyKeystorePassword(keystore, password)
  await secureStorage.removeItem(`wallet_${walletId}`)
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

export const exportSuri = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore && keystore.encSuri && keystore.crypto, 'Invalid keystore')
  const encrypted = await decryptEncPair(password, keystore.encSuri, keystore.crypto)
  return Buffer.from(encrypted, 'hex').toString()
}

export const verifyPassword = async (walletId, password) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  await verifyKeystorePassword(keystore, password)
}

export const signData = async (walletId, password, data) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  const keyPair = await decryptKeyPair(keystore, password)
  const u8aData = stringToU8a(data)
  const signedData = await keyPair.sign(u8aData)
  const signedHex = u8aToHex(signedData)
  return signedHex
}

export const changeWalletName = async (walletId, name) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)

  keystore.meta = keystore.meta || {}
  keystore.meta.name = name
  await secureStorage.setItem(`wallet_${walletId}`, keystore, true)
  return getWallet(keystore.id)
}

export const changeWalletPassword = async (walletId, currentPassword, newPassword) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)

  const meta = keystore.meta
  const keypair = await exportKeyPair(walletId, currentPassword)
  const newOfficialKeystore = keypair.toJson(newPassword)

  const newKeystore = await createKeystore('polkadot', 'keystore', newOfficialKeystore, newPassword, { meta })
  newKeystore.id = keystore.id
  await secureStorage.setItem(`wallet_${newKeystore.id}`, newKeystore, true)
  return getWallet(newKeystore.id)
}

export const changeWalletNetwork = async (walletId, network) => {
  const keystore = await secureStorage.getItem(`wallet_${walletId}`, true)
  assert(keystore, `No keystore for wallet ${walletId}`)

  const newKeystore = await changeKeystoreNetwork(keystore, network)
  await secureStorage.setItem(`wallet_${walletId}`, newKeystore, true)
  return getWallet(newKeystore.id)
}
