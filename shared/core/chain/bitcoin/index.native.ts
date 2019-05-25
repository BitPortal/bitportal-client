import assert from 'assert'
import HDKey from 'hdkey'
import { hash160, bip39 } from 'core/crypto'
import bitcoin from 'core/library/bitcoin'
import coinSelect from 'core/library/coinselect'
import { decryptMnemonic, decryptPrivateKey, exportPrivateKey } from 'core/keystore'
import secp256k1 from 'secp256k1'
import bs58check from 'bs58check'
import { segWit } from 'core/constants'
import { NativeModules } from 'react-native'
import { insightApi, chainSoApi } from 'core/api'

const bip32 = bitcoin.bip32
const { scanHDBTCAddresses } = NativeModules.BPCoreModule
const DUST_THRESHOLD = 2730

function getAddress (node, isSegWit = true) {
  return isSegWit ? bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({ pubkey: node.publicKey })
  }).address : bitcoin.payments.p2pkh({ pubkey: node.publicKey }).address
}

export const getUTXO = async (address: string | string[]) => {
  let utxo = []

  if (typeof address === 'string') {
    utxo = await insightApi('GET', `/addr/${address}/utxo`)
  } else if (typeof address === 'object') {
    utxo = await insightApi('GET', `/addrs/${address.join(',')}/utxo`)
  }

  return utxo
}

export const calculateBalanceFromUTXO = (utxo: any) => {
  const balance = utxo.reduce((balance: number, unspent: any) => +unspent.satoshis + balance, 0)
  return (+balance) * Math.pow(10, -8)
}

export const getBalance = async (address: string | string[]) => {
  if (typeof address === 'string') {
    const balance = await insightApi('GET', `/addr/${address}/balance`)
    return (+balance) * Math.pow(10, -8)
  }  else if (typeof address === 'object') {
    const utxo = await getUTXO(address)
    return calculateBalanceFromUTXO(utxo)
  }

  return 0
}

export const getTransactions = async (address: string | string[], from: number = 0, to: number = 1000) => {
  let transactions = {}

  if (typeof address === 'string') {
    transactions = await insightApi('GET', '/addr/txs', { address })
    return result
  }  else if (typeof address === 'object') {
    transactions = await insightApi('GET', `/addrs/${address.join(',')}/txs`, { from, to })
  }

  return transactions
}

export const getEstimateFee = async () => {
  const fee = await insightApi('GET', '/utils/estimatefee')
  return fee['2']
}

export const getChangeAddress = (utxo: any, addresses: any) => {
  assert(addresses.allIds.length, 'No change address')

  const changeUTXO = utxo.filter((item: any) => +item.change === 1)
  const changeUTXOAddresses = changeUTXO.map((item: any) => item.address)

  let changeAddress

  if (!changeUTXO.length) {
    changeAddress = addresses.byId[addresses.allIds[0]]
  } else if (changeUTXO.length < addresses.allIds.length) {
    for (let i = 0; i < addresses.allIds.length; i++) {
      if (changeUTXOAddresses.indexOf(addresses.allIds[i]) === -1) {
        changeAddress = addresses.byId[addresses.allIds[i]]
        break
      }
    }
  } else {
    changeAddress = changeUTXO[0]
  }

  return changeAddress.address
}

export const getInputsWithIdx = (inputs: any, addresses: any) => inputs.map((input: any) => {
  const addressInfo = addresses.external.byId[input.address] || addresses.change.byId[input.address]
  if (addressInfo) {
    return { ...input, ...addressInfo }
  } else {
    return input
  }
})

export const selectUTXO = async (utxos: any, amount: any, toAddress: any, changeAddress: any, feeRate: any) => {
  assert((+amount) * Math.pow(10, 8) > DUST_THRESHOLD, 'Amount less than minimum')
  const balance = calculateBalanceFromUTXO(utxos)
  assert(+balance > +amount, `You don't have enough balance`)

  const utxosWithValue = utxos.map((utxo: any) => ({ ...utxo, value: utxo.satoshis }))
  const targets = [{ address: toAddress, value: (+amount) * Math.pow(10, 8) }]
  const { inputs, outputs, fee } = coinSelect(utxosWithValue, targets, feeRate)

  assert(inputs && outputs, 'Select utxo failed')

  return {
    inputs,
    fee,
    outputs: outputs.map((output: any) => !output.address ? ({ ...output, address: changeAddress }) : output)
  }
}

export const scanHDAddressesByXpub = async (xpub: string, start: number, end: number, isSegWit: boolean) => {
  const addresses = await scanHDBTCAddresses(xpub, start, end, isSegWit)
  return addresses
}

export const transfer = async (password: string, keystore: any, inputs: any, outputs: any, opReturnHex: string = '') => {
  const isSegWit = keystore.bitportalMeta.segWit && keystore.bitportalMeta.segWit !== segWit.none
  const mnemonic = await decryptMnemonic(password, keystore)
  const seed = bip39.mnemonicToSeed(mnemonic)
  const root = bip32.fromSeed(seed)
  const path = keystore.mnemonicPath
  const node = root.derivePath(path)

  const txb = new bitcoin.TransactionBuilder()
  txb.setVersion(1)

  for (const input of inputs) {
    txb.addInput(input.txid, input.vout)
  }

  for (const output of outputs) {
    txb.addOutput(output.address, output.value)
  }

  if (opReturnHex) {
    // add opt return data
    const data = Buffer.from(opReturnHex, 'hex')
    const embed = bitcoin.payments.embed({ data: [data] })
    txb.addOutput(embed.output, 0)
  }

  for (let i = 0; i < inputs.length; i++) {
    const child = node.derive(+inputs[i].change).derive(+inputs[i].index)
    const keyPair = bitcoin.ECPair.fromPrivateKey(child.privateKey)

    if (isSegWit) {
      const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })
      const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh })
      txb.sign(i, keyPair, p2sh.redeem.output, null, inputs[i].value)
    } else {
      txb.sign(i, keyPair)
    }
  }

  const tx = txb.build()
  const tx_hex = tx.toHex()

  const result = await chainSoApi('POST', '/send_tx/BTC', { tx_hex })
  return result.data.txid
}


export const transferByWif = async (password: string, keystore: any, inputs: any, outputs: any, opReturnHex: string = '') => {
  const isSegWit = keystore.bitportalMeta.segWit && keystore.bitportalMeta.segWit !== segWit.none
  const privateKey = await exportPrivateKey(password, keystore, 'WIF')

  const txb = new bitcoin.TransactionBuilder()
  txb.setVersion(1)

  for (const input of inputs) {
    txb.addInput(input.txid, input.vout)
  }

  for (const output of outputs) {
    txb.addOutput(output.address, output.value)
  }

  if (opReturnHex) {
    // add opt return data
    const data = Buffer.from(opReturnHex, 'hex')
    const embed = bitcoin.payments.embed({ data: [data] })
    txb.addOutput(embed.output, 0)
  }

  const keyPair = bitcoin.ECPair.fromWIF(privateKey)
  for (let i = 0; i < inputs.length; i++) {
    if (isSegWit) {
      const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey })
      const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh })
      txb.sign(i, keyPair, p2sh.redeem.output, null, inputs[i].value)
    } else {
      txb.sign(i, keyPair)
    }
  }

  const tx = txb.build()
  const tx_hex = tx.toHex()

  const result = await chainSoApi('POST', '/send_tx/BTC', { tx_hex })
  return result.data.txid
}
