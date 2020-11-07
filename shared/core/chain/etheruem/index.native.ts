import assert from 'assert'
import secp256k1 from 'secp256k1'
import { keccak256 } from 'core/crypto'
import { signETHTransaction, decryptPrivateKey } from 'core/keystore'
import { etherscanApi, web3 } from 'core/api'
import { addABI, decodeMethod } from 'core/library/abiDecoder'
import { erc20ABI } from 'core/constants'
import abi from 'resources/abis/humanStandardToken.abi'
import Big from 'big.js'
import sigUtil from 'eth-sig-util'

addABI(abi)

export const getBalance = async (address: string, contractAddress: string = null, tokenDecimals: number) => {
  let decimals = 18

  if (typeof tokenDecimals === 'number') {
    decimals = tokenDecimals
  }

  if (contractAddress) {
    const result = await etherscanApi('GET', '', {
      module: 'account',
      action: 'tokenbalance',
      contractAddress,
      address,
      tag: 'latest'
    })

    return (+result.result) * Math.pow(10, -decimals)
  } else {
    const balance = await web3.eth.getBalance(address)
    return (+balance) * Math.pow(10, -decimals)
  }
}

export const getTransactions = async (address: string, startblock: number = 0, endblock: number = 99999999, page: number = 1, offset: number = 20, contract: string) => {
  if (contract) {
    const result = await etherscanApi('GET', '', {
      module: 'account',
      action: 'tokentx',
      contractAddress: contract,
      sort: 'desc',
      startblock,
      endblock,
      address,
      page,
      offset
    })
    console.log('eth token getTransactions', result)

    return result.result
  } else {
    const result = await etherscanApi('GET', '', {
      module: 'account',
      action: 'txlist',
      sort: 'desc',
      startblock,
      endblock,
      address,
      page,
      offset
    })
    console.log('eth getTransactions', result)

    return result.result
  }
}

export const bigValuePow = (value, exponent) => {
  return +(new Big(value).times(new Big(Math.pow(10, exponent)).round(-exponent).toFixed(-exponent)))
}

export const getETHGasPrice = async () => {
  const networkGasPrice = await web3.eth.getGasPrice()
  return +(new Big(networkGasPrice).times(new Big(Math.pow(10, -9)).round(9).toFixed(9)))
}

export const getCode = async (address: string) => {
  const result = await web3.eth.getCode(address)
  return result
}

export const web3Sha3 = async (data: string) => {
  const message = Buffer.from(removeHexPrefix(data), 'hex')
  const result = await keccak256(message)
  return '0x' + result.toString('hex')
}

export const getBlockNumber = async () => {
  const result = await web3.eth.getBlockNumber()
  return '0x' + (+result).toString('16')
}

export const getEstimategas = async (params: any) => {
  const result = await web3.eth.estimateGas(params)
  return '0x' + (+result).toString('16')
}

export const getGasPrice = async () => {
  const networkGasPrice = await web3.eth.getGasPrice()
  return web3.utils.toHex(networkGasPrice)
}

export const getWeb3Balance = async (address: string) => {
  const balance = await web3.eth.getBalance(address)
  return '0x' + (+balance).toString('16')
}

export const getBlock = async (blockHashOrBlockNumber: string | number, returnTransactionObjects: boolean) => {
  const block = await web3.eth.getBlock(blockHashOrBlockNumber, returnTransactionObjects)
  return block
}

export const getBlockTransactionNumber = async (id: string | number) => {
  const count = await web3.eth.getBlockTransactionCount(id)
  return '0x' + (+count).toString('16')
}

export const getStorageAt = async (address: string, index: number) => {
  const storage = await web3.eth.getStorageAt(address, index)
  return '0x' + (+storage).toString('16')
}

export const getTransactionFromBlock = async (hashStringOrNumber: string, index: number) => {
  const transaction = await web3.eth.getTransactionFromBlock(hashStringOrNumber, index)
  return transaction
}

export const getUncle = async (hashStringOrNumber: string, uncleIndex: number, returnTransactionObjects?: boolean = false) => {
  const transaction = await web3.eth.getUncle(hashStringOrNumber, uncleIndex, returnTransactionObjects)
  return transaction
}

export const getTransaction = async (hash: string) => {
  const result = await web3.eth.getTransaction(hash)
  return result
}

export const getTransactionReceipt = async (hash: string) => {
  const result = await web3.eth.getTransactionReceipt(hash)
  return result
}

export const getTransactionCount = async (address: string, defaultBlock?: number | string) => {
  const result = await web3.eth.getTransactionCount(address, defaultBlock)
  return '0x' + (+result).toString('16')
}

export const getBlockTransactionCount = async (blockHashOrBlockNumber: string) => {
  const result = await web3.eth.getBlockTransactionCount(blockHashOrBlockNumber)
  return '0x' + (+result).toString('16')
}

export const getWork = async () => {
  const result = await web3.eth.getWork()
  return result
}

export const getHashrate = async () => {
  const result = await web3.eth.getHashrate()
  return '0x' + (+result).toString('16')
}

export const submitWork = async (nonce: string, powHash: string, digest: string) => {
  const result = await web3.eth.submitWork(nonce, powHash, digest)
  return result
}

export const sign = async (dataToSign: string, address: string) => {
  const result = await web3.eth.sign(dataToSign, address)
  return result
}

export const call = async (callObject: any, defaultBlock: number | string) => {
  const result = await web3.eth.call(callObject, defaultBlock)
  return result
}

export const estimateGas = async (rawTx: string) => {
  const result = await web3.eth.estimateGas(rawTx)
  return result
}

const removeHexPrefix = (data) => {
  return data.indexOf('0x') === 0 ? data.slice(2): data
}

const addHexPrefix = (data) => {
  return data.indexOf('0x') === 0 ? data : '0x' + data
}

export const ethSign = async (password: string, keystore: any, data: string) => {
  const privateKey = await decryptPrivateKey(password, keystore)
  const message = Buffer.from(removeHexPrefix(data), 'hex')
  const hash = await keccak256(message)

  const sig = secp256k1.sign(hash, Buffer.from(privateKey, 'hex'))
  const recovery: number = sig.recovery
  const ret = {
    r: sig.signature.slice(0, 32),
    s: sig.signature.slice(32, 64),
    v: recovery + 27
  }

  return addHexPrefix(Buffer.concat([ret.r, ret.s, Buffer.from([ret.v])]).toString('hex'))
}

export const personalSign = async (password: string, keystore: any, data: string) => {
  const privateKey = await decryptPrivateKey(password, keystore)
  const message = Buffer.from(removeHexPrefix(data), 'hex')
  const prefix = Buffer.from(`\u0019Ethereum Signed Message:\n${message.length.toString()}`)
  const hash = await keccak256(Buffer.concat([prefix, message]))

  const sig = secp256k1.sign(hash, Buffer.from(privateKey, 'hex'))
  const recovery: number = sig.recovery
  const ret = {
    r: sig.signature.slice(0, 32),
    s: sig.signature.slice(32, 64),
    v: recovery + 27
  }

  return addHexPrefix(Buffer.concat([ret.r, ret.s, Buffer.from([ret.v])]).toString('hex'))
}

export const personalEcRecover = async (data: string, sig: string) => {
  return sigUtil.recoverPersonalSignature({ data, sig })
}

export const typedDataSign = async (password: string, keystore: any, typedData: string) => {
  const privateKey = await decryptPrivateKey(password, keystore)
  const sig = sigUtil.signTypedDataLegacy(Buffer.from(privateKey, 'hex'), { data: typedData })
  return sig
}

export const typedDataSignV3 = async (password: string, keystore: any, typedDataString: string) => {
  const privateKey = await decryptPrivateKey(password, keystore)
  const sig = sigUtil.signTypedData(Buffer.from(privateKey, 'hex'), { data: JSON.parse(typedDataString) })
  return sig
}

export const typedDataSignV4 = async (password: string, keystore: any, typedDataString: string) => {
  const privateKey = await decryptPrivateKey(password, keystore)
  const sig = sigUtil.signTypedData_v4(Buffer.from(privateKey, 'hex'), { data: JSON.parse(typedDataString) })
  return sig
}

const submitTransaction = async (rawTransaction: string) => {
  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(rawTransaction).on('transactionHash', (hash) => {
      resolve(hash)
    }).on('error', (error) => {
      reject(error)
    })
  })
}

export const transfer = async (password: string, keystore: any, fromAddress: string, toAddress: string, amount: string, gasPrice?: string, gasLimit?: string, data?: string, nonce?: string) => {
  const rawTx = {
    from: fromAddress,
    to: toAddress,
    value: web3.utils.toHex((+amount) * Math.pow(10, 18)),
    data: data || ''
  }

  if (!nonce) {
    const transactionCount = await web3.eth.getTransactionCount(fromAddress)
    rawTx.nonce = web3.utils.toHex(transactionCount)
  }

  if (!gasPrice) {
    const networkGasPrice = await web3.eth.getGasPrice()
    rawTx.gasPrice = web3.utils.toHex(networkGasPrice)
  } else {
    rawTx.gasPrice = web3.utils.toHex(gasPrice)
  }

  if (!gasLimit) {
    const estimateGas = await web3.eth.estimateGas(rawTx)
    rawTx.gasLimit = estimateGas
  } else {
    rawTx.gasLimit = gasLimit
  }

  const rawTransaction = await signETHTransaction(rawTx, password, keystore)
  const hash = await submitTransaction('0x' + rawTransaction.toString('hex'))
  return hash
}

export const transferToken = async (password: string, keystore: any, fromAddress: string, toAddress: string, contract: string, amount: string, decimals: number, gasPrice?: string, gasLimit?: string, nonce?: string) => {
  const tokenContract = new web3.eth.Contract(erc20ABI, contract, { from: fromAddress })
  const data = tokenContract.methods.transfer(toAddress, web3.utils.toHex((+amount) * Math.pow(10, decimals))).encodeABI()

  const rawTx = {
    from: fromAddress,
    to: contract,
    value: '0x00',
    data: data || ''
  }

  if (!nonce) {
    const transactionCount = await web3.eth.getTransactionCount(fromAddress)
    rawTx.nonce = web3.utils.toHex(transactionCount)
  }

  if (!gasPrice) {
    const networkGasPrice = await web3.eth.getGasPrice()
    rawTx.gasPrice = web3.utils.toHex(networkGasPrice)
  } else {
    rawTx.gasPrice = web3.utils.toHex(gasPrice)
  }

  if (!gasLimit) {
    const estimateGas = await web3.eth.estimateGas(rawTx)
    rawTx.gasLimit = estimateGas
  } else {
    rawTx.gasLimit = gasLimit
  }

  const rawTransaction = await signETHTransaction(rawTx, password, keystore)
  const hash = await submitTransaction('0x' + rawTransaction.toString('hex'))
  return hash
}

export const sendTransaction = async (password: string, keystore: any, transactionObject: any) => {
  const fromAddress = transactionObject.from
  let nonce = transactionObject.nonce
  let finalGasLimit

  if (!nonce) {
    const transactionCount = await web3.eth.getTransactionCount(fromAddress)
    nonce = web3.utils.toHex(transactionCount)
  }

  if (transactionObject.gasLimit) {
    finalGasLimit = web3.utils.toHex(transactionObject.gasLimit)
  } else {
    finalGasLimit = web3.utils.toHex(21000)
  }

  const rawTransaction = await signETHTransaction({ ...transactionObject, nonce, gasLimit: finalGasLimit }, password, keystore)
  const hash = await submitTransaction('0x' + rawTransaction.toString('hex'))
  return hash
}

export const signTransaction = async (password: string, keystore: any, transactionObject: any) => {
  const fromAddress = transactionObject.from
  let nonce = transactionObject.nonce
  let finalGasLimit

  if (!nonce) {
    const transactionCount = await web3.eth.getTransactionCount(fromAddress)
    nonce = web3.utils.toHex(transactionCount)
  }

  if (transactionObject.gasLimit) {
    finalGasLimit = web3.utils.toHex(transactionObject.gasLimit)
  } else {
    finalGasLimit = web3.utils.toHex(21000)
  }

  const rawTransaction = await signETHTransaction({ ...transactionObject, nonce, gasLimit: finalGasLimit }, password, keystore)
  return '0x' + rawTransaction.toString('hex')
}

export const sendRawTransaction = async (rawTransaction) => {
  const hash = await submitTransaction(rawTransaction)
  return hash
}

export const decodeData = (data: string = '') => {
  return decodeMethod(data)
}

export const getProtocolVersion = async () => {
  const result = await web3.eth.getProtocolVersion()
  return result
}

export const isSyncing = async () => {
  const result = await web3.eth.isSyncing()
  return result
}

export const isMining = async () => {
  const result = await web3.eth.isMining()
  return result
}

export const isListening = async () => {
  const result = await web3.eth.net.isListening()
  return result
}

export const getPeerCount = async () => {
  const result = await web3.eth.net.getPeerCount()
  return result
}

export const hexToUtf8 = (hex) => {
  return web3.utils.hexToUtf8(hex)
}
