import { chainxScanApi } from 'core/api'
import { decryptPrivateKey, decryptMnemonic } from 'core/keystore'
import Chainx from 'chainx.js'


export const initChainx = async (network: string = 'mainnet') => {
  // Todo:: fix init
    let chainx = new Chainx('wss://w2.chainx.org/ws')
    if (chainx) {
      chainx.account.setNet('mainnet')
      await chainx.isRpcReady()
      return chainx
    }
    else {
      chainx = new Chainx('wss://w1.chainx.org/ws')
      if (chainx && chainx.provider) {
        chainx.account.setNet('mainnet')
        await chainx.isRpcReady()
        return chainx
      } else {
        console.error('failed to init chainx')
        return false
      }
    }
}

export const getInfo = async () => {
  const chainx = await initChainx('mainnet')
  const info = await chainx.chain.getInfo()
  const trustee = await chainx.trustee.getTrusteeSessionInfo('Bitcoin')
  return {info, trustee}
}

export const getBalance = async (address: string) => {
  const chainx = await initChainx('mainnet')
  const balance = await chainx.asset.getAssetsByAccount(address, 0, 1)
  return (+balance.data[0].details.Free) * Math.pow(10, -8)
}

export const getAsset = async (address: string) => {
  const asset = await chainx.asset.getAssetsByAccount(address, 0, 1)
  return asset
}

export const getTransactions = async (publicKey: string, page: number = 0, pageSize: number = 10) => {
  const result = await chainxScanApi('GET', '/account/' + publicKey + '/txs', {
    page,
    page_size: pageSize
  })
  return result.items
}

export const getTransaction = async (hash: string) => {
  return ''
}

export const getBlockNumber = async () => {
  const chainx = await initChainx()
  return await chainx.chain.getBlockNumber()
}

export const getBlock = async (id: string | number, returnTransactionObjects: boolean) => {

}

export const getBlockTransactionNumber = async (id: string | number) => {

}

export const transfer = async (password: string, keystore: any, fromAddress: string, toAddress: string, symbol: string, amount: string, memo: string = '') => {
  const chainx = await initChainx('mainnet')

  const txToSign = await chainx.asset.transfer(toAddress, symbol, amount * Math.pow(10, 8), memo)

  const privateKey = await decryptPrivateKey(password, keystore)

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
//
export const getAddressByAccount = async (address: string) => {
  const chainx = await initChainx('mainnet')
  return await chainx.asset.getAddressByAccount(address, 'Bitcoin')
}

export const getIntentions = async () => {
  const chainx = await initChainx('mainnet')
  return await chainx.stake.getIntentions()
}

export const getDepositOpReturn = (address, nodeName = 'BitPortal') => {
  return new Buffer.from(address + '@' + nodeName, 'utf-8').toString('hex')
}
