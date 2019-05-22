import { chainxScanApi } from 'core/api'
import { decryptPrivateKey, decryptMnemonic } from 'core/keystore'
import Chainx from 'chainx.js'

export const initChainx = async (network: string) => {
  // Todo:: fix init
  const chainx = new Chainx('wss://w1.chainx.org/ws')
  chainx.account.setNet('mainnet')
  // (network.toLowerCase() === 'mainnet') ? chainx.account.setNet('mainnet') : chainx.account.setNet('testnet')
  await chainx.isRpcReady()
  return chainx
}

export const getBalance = async (address: string) => {
  const chainx = await initChainx('mainnet')
  console.log('running get balance', chainx)
  const balance = await chainx.asset.getAssetsByAccount(address, 0, 1)
  console.log('get chainx balance', balance)
  return (+balance.data[0].details.Free) * Math.pow(10, -8)
}

export const getAsset = async (address: string) => {
  const asset = await chainx.asset.getAssetsByAccount(address, 0, 1)
  return asset
}

export const getTransactions = async (address: string, page: number = 0, pageSize: number = 10) => {
  const result = await chainxScanApi('GET', '/account/' + address + '/txs', {
    page,
    page_size: pageSize
  })
  return result.items
}

export const getTransaction = async (hash: string) => {
  return ''
}

export const getBlockNumber = async () => {

}

export const getBlock = async (id: string | number, returnTransactionObjects: boolean) => {

}

export const getBlockTransactionNumber = async (id: string | number) => {

}

export const transfer = async (password: string, keystore: any, fromAddress: string, toAddress: string, symbol: string, amount: string, memo: string = '') => {
  const chainx = await initChainx('mainnet')

  console.log('CHAINX Transfer', password, keystore, fromAddress, toAddress, amount, memo)
  const txToSign = await chainx.asset.transfer(toAddress, symbol, amount * Math.pow(10, 8), memo)

  const privateKey = await decryptPrivateKey(password, keystore)
  console.log('private key', privateKey, Buffer.from(privateKey, 'hex').toString())

  // chainx.account.from(mnemonic).derive().privateKey()

  // Todo:: check address

  txToSign.signAndSend(Buffer.from(privateKey, 'hex').toString(), (error, response) => {
    if (error) console.error(error)
    else if (response.status === 'Finalized') {
      if (response.result === 'ExtrinsicSuccess') {
        return response.txHash
      } else {
        console.log(response)
        return false
      }
    } else {
      return false
    }
  })
}
