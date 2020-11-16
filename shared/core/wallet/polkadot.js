// import uuidv1 from 'uuid/v1'
import assert from 'assert'
import { secureStorage } from 'storage'
import { u8aToHex } from 'utils/u8a'
import { stringToU8a } from 'utils/string'
import {
  createPolkadotKeystore,
  createPolkadotKeystoreBySuri,
  verifyPolkadotPassword,
  exportPolkadotKeyPair,
  exportPolkadotKeystore,
  changePolkadotNetwork,
  changePolkadotAddressFormat
} from './keystore/polkadot'
import { decryptEncPair } from './utils'

// export const scanExtensionWallets = async () => {
//   const { web3Accounts, web3Enable } = await import('@polkadot/extension-dapp'/* webpackChunkName: 'extension-dapp' */)

//   await web3Enable('rio')
//   const allAccounts = await web3Accounts()
//   const polkadotExtensionWallets = await Promise.all(
//     allAccounts
//       .filter(wallet => wallet.meta.source === 'polkadot-js')
//       .map(async wallet => ({
//         id: wallet.address,
//         address: await changePolkadotAddressFormat(wallet.address, 'rio'),
//         name: wallet.meta.name,
//         chain: 'polkadot',
//         source: 'extension',
//         network: 'rio',
//         timestamp: +Date.now()
//       }))
//   )

//   return polkadotExtensionWallets
// }

export const getKeystoreByWalletId = async (walletId) => {
  const keystore = await secureStorage.getItem(`IDENTITY_WALLET_KEYSTORE_${walletId}`, true) || await secureStorage.getItem(`IMPORTED_WALLET_KEYSTORE_${walletId}`, true)
  return keystore
}

export const getWallet = async (walletId) => {
  const keystore = await getKeystoreByWalletId(walletId)
  const newKeystore = await changePolkadotNetwork(keystore, 'rio')

  return {
    id: keystore.id,
    address: newKeystore.address,
    ...newKeystore.meta
  }
}

// export const scanWallets = async () => {
//   const storageKeys = await secureStorage.getAllKeys()
//   return Promise.all(storageKeys.filter(key => key.indexOf('wallet_') === 0).map(key => getWallet(key.slice('wallet_'.length))))
// }

export const importWallet = async (chain, source, value, password, options = {}) => {
  const keystore = await createPolkadotKeystore(source, value, password, options)
  await secureStorage.setItem(`wallet_${keystore.id}`, keystore, true)
  return getWallet(keystore.id)
}

export const deleteWallet = async (walletId, password) => {
  const keystore = await getKeystoreByWalletId(walletId)
  await verifyPolkadotPassword(keystore, password)
  await secureStorage.removeItem(`wallet_${walletId}`)
}

export const exportKeyPair = async (walletId, password) => {
  const keystore = await getKeystoreByWalletId(walletId)
  const keyPair = await exportPolkadotKeyPair(keystore, password)
  return keyPair
}

export const exportKeystore = async (walletId, password) => {
  const keystore = await getKeystoreByWalletId(walletId)
  const officialKeystore = await exportPolkadotKeystore(keystore, password)
  return officialKeystore
}

export const exportSuri = async (walletId, password) => {
  const keystore = await getKeystoreByWalletId(walletId)
  assert(keystore && keystore.encSuri && keystore.crypto, 'Invalid keystore')
  const encrypted = await decryptEncPair(password, keystore.encSuri, keystore.crypto)
  return Buffer.from(encrypted, 'hex').toString()
}

export const verifyPassword = async (walletId, password) => {
  const keystore = await getKeystoreByWalletId(walletId)
  await verifyPolkadotPassword(keystore, password)
}

export const signData = async (walletId, password, data) => {
  const keystore = await getKeystoreByWalletId(walletId)
  const keyPair = await exportPolkadotKeyPair(keystore, password)
  const u8aData = stringToU8a(data)
  const signedData = await keyPair.sign(u8aData)
  const signedHex = u8aToHex(signedData)
  return signedHex
}

export const changeWalletName = async (walletId, name) => {
  const keystore = await getKeystoreByWalletId(walletId)
  keystore.meta = keystore.meta || {}
  keystore.meta.name = name
  await secureStorage.setItem(`wallet_${walletId}`, keystore, true)
  return getWallet(keystore.id)
}

export const changeWalletPassword = async (walletId, currentPassword, newPassword) => {
  const keystore = await getKeystoreByWalletId(walletId)
  const meta = keystore.meta
  const keypair = await exportKeyPair(walletId, currentPassword)
  const newOfficialKeystore = keypair.toJson(newPassword)

  const newKeystore = await createPolkadotKeystore('keystore', newOfficialKeystore, newPassword, { meta })
  newKeystore.id = keystore.id
  await secureStorage.setItem(`wallet_${newKeystore.id}`, newKeystore, true)
  return getWallet(newKeystore.id)
}

export const changeWalletNetwork = async (walletId, network) => {
  const keystore = await getKeystoreByWalletId(walletId)
  const newKeystore = await changePolkadotNetwork(keystore, network)
  await secureStorage.setItem(`wallet_${walletId}`, newKeystore, true)
  return getWallet(newKeystore.id)
}
