import assert from 'assert'
import secp256k1 from 'secp256k1'
import { keccak256 } from 'core/crypto'
import { signETHTransaction, decryptPrivateKey } from 'core/keystore'
import { etherscanApi, web3 } from 'core/api'

export const getBalance = async (address: string) => {
  const balance = await web3.eth.getBalance(address)
  return (+balance) * Math.pow(10, -18)
}

export const getTransactions = async (address: string, startblock: number = 0, endblock: number = 99999999, page: number = 1, offset: number = 20) => {
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

  return result.result
}

export const getTransaction = async (hash: string) => {
  const result = await web3.eth.getTransactionReceipt(hash)
  return result
}

export const getETHGasPrice = async () => {
  const networkGasPrice = await web3.eth.getGasPrice()
  return networkGasPrice * Math.pow(10, -9)
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
  return '0x' + (+networkGasPrice).toString('16')
}

export const getWeb3Balance = async (address: string) => {
  const balance = await web3.eth.getBalance(address)
  return '0x' + (+balance).toString('16')
}

export const getBlock = async (id: string | number, returnTransactionObjects: boolean) => {
  const block = await web3.eth.getBlock(id, returnTransactionObjects)
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

export const getTransactionByBlockHashAndIndex = async (hash: string, index: number) => {
  const block = await getBlock(hash, index)
}

// export const getETHGasLimit = async (hash: string) => {
//   const estimateGas = await web3.eth.estimateGas(rawTx)
//   return estimateGas
// }

const removeHexPrefix = (data) => {
  return data.indexOf('0x') === 0 ? data.slice(2): data
}

const addHexPrefix = (data) => {
  return data.indexOf('0x') === 0 ? data : '0x' + data
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

const sendTransaction = async (rawTransaction: string) => {
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
  const hash = await sendTransaction('0x' + rawTransaction.toString('hex'))
  return hash
}
