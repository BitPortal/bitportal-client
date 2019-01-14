import assert from 'assert'
import { signETHTransaction } from 'core/keystore'
import { etherscanApi, web3 } from 'core/api'

export const getBalance = async (address: string) => {
  const balance = await web3.eth.getBalance(address)
  return (+balance) * Math.pow(10, -18)
}

export const getTransactions = async (address: string, startblock: number = 0, endblock: number = 99999999) => {
  const result = await etherscanApi('GET', '', {
    module: 'account',
    action: 'txlist',
    sort: 'asc',
    startblock,
    endblock,
    address
  })
  return result.result
}

export const getTransaction = async (hash: string) => {
  const result = await web3.eth.getTransactionReceipt(hash)
  return result
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
  }

  if (!gasLimit) {
    const estimateGas = await web3.eth.estimateGas(rawTx)
    rawTx.gasLimit = estimateGas
  }

  const rawTransaction = await signETHTransaction(rawTx, password, keystore)
  const hash = await sendTransaction('0x' + rawTransaction.toString('hex'))
  return hash
}
