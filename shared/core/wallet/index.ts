import assert from 'assert'
import { bip39 } from 'core/crypto'
import {
  createIdentityKeystore,
  createHDBTCKeystore,
  createHDETHKeystore,
  createHDEOSKeystore
} from 'core/keystore'
import { source, network as networkType } from 'core/constants'

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
  const eosWalletKeystore = await createHDEOSKeystore(metadata, mnemonicCodes, password)

  const wallets = [btcWalletKeystore, ethWalletKeystore, eosWalletKeystore]
  keystore.walletIDs.push(btcWalletKeystore.id)
  keystore.walletIDs.push(ethWalletKeystore.id)
  keystore.walletIDs.push(eosWalletKeystore.id)

  return { keystore, wallets }
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
  const eosWalletKeystore = await createHDEOSKeystore(metadata, mnemonicCodes, password)

  const wallets = [btcWalletKeystore, ethWalletKeystore, eosWalletKeystore]
  keystore.walletIDs.push(btcWalletKeystore.id)
  keystore.walletIDs.push(ethWalletKeystore.id)
  keystore.walletIDs.push(eosWalletKeystore.id)

  return { keystore, wallets }
}
