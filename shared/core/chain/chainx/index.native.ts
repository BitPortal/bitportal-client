import { chainxScanApi } from 'core/api'
import { decryptPrivateKey, decryptMnemonic } from 'core/keystore'
import { ApiBase, HttpProvider } from 'chainx.js'
import chainxAccount from '@chainx/account'
import { walletType } from 'core/constants'

export const initRpc = () => {
  return new HttpProvider('http://chainx.bitportal.io:8080/rpc')
}

export const initApibase = async () => {
  const chainx = new ApiBase(new HttpProvider('http://chainx.bitportal.io:8080/rpc'), ['http://chainx.bitportal.io:8080/rpc'])
  await chainx._isReady
  return chainx
}

const getPrivateKeyFromKeyStore = async (password: string, keystore: any) => {
  let privateKey
  if (keystore && keystore.bitportalMeta) {
    if (keystore.bitportalMeta.walletType === walletType.hd) {
      const mnemonics = await decryptMnemonic(password, keystore)
      privateKey = chainxAccount.from(mnemonics).derive().privateKey()
    } else if (keystore.bitportalMeta.walletType === walletType.imported){
      privateKey = await decryptPrivateKey(password, keystore)
      privateKey = Buffer.from(privateKey, 'hex').toString()
    } else {
      console.error('invalid wallet type in keystore')
    }
  }
  return privateKey
}

export const getBalance = async (address: string) => {
  const provider = initRpc()
  const balance = await provider.send('chainx_getAssetsByAccount', [chainxAccount.decodeAddress(address), 0, 1])
  if (!balance || !balance.data || balance.data.length === 0) {
    return 0
  }

  return (+balance.data[0].details.Free) * Math.pow(10, -8)
}

export const getPseduIntentions = async () => {
  const provider = initRpc()
  const asset = await provider.send('chainx_getPseduIntentions', [])
  return asset
}

export const getPseduNominationRecords = async (address: string) => {
  const provider = initRpc()
  return await provider.send('chainx_getPseduNominationRecords', [chainxAccount.decodeAddress(address)])
}

export const getAssetsBalance = async (address: string) => {
  const provider = initRpc()
  const asset = await provider.send('chainx_getAssetsByAccount', [chainxAccount.decodeAddress(address), 0, 10])
  return asset
}

export const getTransactions = async (address: string, page: number = 0, pageSize: number = 10) => {
  const result = await chainxScanApi('GET', '/account/' + chainxAccount.decodeAddress(address) + '/txs', {
    page,
    page_size: pageSize
  })
  return result
}

export const getTransaction = async (hash: string) => {
  return ''
}

export const getBlockHeight = async () => {
  const result = await chainxScanApi('GET', '/chain/height', {})
  console.log(result)
  if (result && result.height) {
    return result.height
  } else {
    return 0
  }
}

export const getBlock = async (id: string | number, returnTransactionObjects: boolean) => {

}

export const getBlockTransactionNumber = async (id: string | number) => {

}

export const getAddressByAccount = async (address: string) => {
  const provider = initRpc()
  const addresses = await provider.send('chainx_getAddressByAccount', [chainxAccount.decodeAddress(address), 'Bitcoin'])
  return addresses
}

export const getTrusteeSessionInfo = async () => {
  const provider = initRpc()
  return await provider.send('chainx_getTrusteeSessionInfo', ['Bitcoin'])
}

export const getIntentions = async () => {
  const provider = initRpc()
  const intentions = await provider.send('chainx_getIntentions', [])
  return intentions
}

export const getNominationRecords = async (address) => {
  const provider = initRpc()
  const pubkey = chainxAccount.decodeAddress(address)
  const records = await provider.send('chainx_getNominationRecords', [pubkey])
  return records
}

export const getDepositOpReturn = (address, nodeName = 'BitPortal') => {
  return new Buffer.from(address + '@' + nodeName, 'utf-8').toString('hex')
}

export const getSdotMappingData = (address, nodeName = 'BitPotal') => {
  return getDepositOpReturn(address, nodeName)
}

export const transfer = async (password: string, keystore: any, fromAddress: string, toAddress: string, symbol: string, precision: number, amount: string, memo: string = '') => {
  const realAmount = (+amount) * Math.pow(10, parseInt(precision, 10))

  const chainx = await initApibase()

  // if (['PCX', 'BTC', 'SDOT'].indexOf(symbol) === -1) {
  //   throw new Error('Invalid ChainX Symbol')
  // }

  // 生成转账交易
  // console.log('transfer params', fromAddress, toAddress, symbol, realAmount, memo)
  const extrinsic = chainx.tx.xAssets.transfer(toAddress, symbol, realAmount, memo ? memo : '')

  // 获取该账户交易次数
  const nonce = await chainx.query.system.accountNonce(fromAddress)

  const pk = await getPrivateKeyFromKeyStore(password, keystore)

  // const signed = extrinsic.sign(privateKeyHex, {nonce, acceleration = 1, blockHash: chainx.genesisHash })
  const txId = await extrinsic.signAndSend(pk, { nonce, acceleration: 2 })
  return txId
}

export const vote = async (password: string, keystore: any, fromAddress: string, targetAddress: string, amount: string, memo: string) => {
  const realAmount = (+amount) * Math.pow(10, 8)

  const chainx = await initApibase()

  const extrinsic = chainx.tx.xStaking.nominate(targetAddress, realAmount, memo)

  // Get Nonce
  const nonce = await chainx.query.system.accountNonce(fromAddress)

  const pk = await getPrivateKeyFromKeyStore(password, keystore)

  const txId = await extrinsic.signAndSend(pk, { nonce, acceleration: 1 })
  return txId
}

export const voteClaim = async (password: string, keystore: any, fromAddress: string, targetAddress: string) => {
  const chainx = await initApibase()

  // Generate Transaction
  const extrinsic = chainx.tx.xStaking.claim(targetAddress)

  // Get Nonce
  const nonce = await chainx.query.system.accountNonce(fromAddress)

  const pk = await getPrivateKeyFromKeyStore(password, keystore)

  const txId = await extrinsic.signAndSend(pk, { nonce, acceleration: 1 })
  return txId
}

export const depositClaim = async (password: string, keystore: any, fromAddress: string, asset = 'BTC') => {
  if (['BTC', 'SDOT'].indexOf(asset) === -1) {
    throw new Error('Invalid asset' + asset.toString())
  }
  const chainx = await initApibase()

  // Generate Transaction
  const extrinsic = chainx.tx.xTokens.claim(asset)

  // Get Nonce
  const nonce = await chainx.query.system.accountNonce(fromAddress)

  const pk = await getPrivateKeyFromKeyStore(password, keystore)

  const txId = await extrinsic.signAndSend(pk, { nonce, acceleration: 1 })
  return txId
}
