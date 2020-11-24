// import assert from 'assert'
import { ApiPromise, WsProvider } from '@polkadot/api'
import Decimal from 'decimal.js'
import { RIO_CHAIN_API,SCAN_API } from 'constants/env'
import { u8aToHex } from 'utils/u8a'
import { stringToU8a } from 'utils/string'
import * as bip32 from 'bip32'
import chainTypes from './chainTypes'
import rpcInterface from './rpcInterface'
import { precalculate } from './create2'

// 'wss://node.staging.riodefi.com/' '192.168.1.36:9944'
const defaultUrl = RIO_CHAIN_API

const createdApi = {}
const createdWsProvider = {}

export let RioChainURL = {
  rio_url: RIO_CHAIN_API,
  rio_scan_url: SCAN_API
}

export const polkaApi = async (baseUrl) => {

  const url = baseUrl || defaultUrl
  RioChainURL.url = url

  if (createdApi[url]) {
    return createdApi[url]
  }

  const wsProvider = new WsProvider(url)
  const api = await ApiPromise.create({
    rpc: rpcInterface,
    provider: wsProvider,
    types: chainTypes
  })
  await api.isReady
  createdApi[url] = api
  console.log('api created: ', url)
  return api
}

export const polkaWsProvider = async (baseUrl) => {
  const url = baseUrl || defaultUrl

  if (createdWsProvider[url]) {
    return createdWsProvider[url]
  }

  const wsProvider = new WsProvider(url)
  createdWsProvider[url] = wsProvider
  console.log('wsProvider created: ', url)
  return wsProvider
}

export const getChainStatus = async (url) => {
  let startTime = +Date.now()
  let lastHeader

  if (createdApi[url]) {
    const api = createdApi[url]
    lastHeader = await api.rpc.chain.getHeader()
    console.log('getChainStatus created', url)
  } else {
    const wsProvider = await polkaWsProvider(url)
    startTime = +Date.now()
    lastHeader = await wsProvider.send('chain_getHeader', [])
    createdWsProvider[url] = wsProvider
  }

  const endTime = +Date.now()
  const delayTime = endTime - startTime
  const blockNumber = Number(lastHeader.number)

  return {
    delayTime,
    blockNumber,
    url
  }
}

// export const getPolkaApiForAccount = async (sender, url) => {
//   const api = await polkaApi(url)

//   if (typeof sender === 'string') {
//     const { web3FromAddress } = await import('@polkadot/extension-dapp'/* webpackChunkName: 'extension-dapp' */)
//     const injector = await web3FromAddress(sender)
//     api.setSigner(injector.signer)
//   }

//   return api
// }

export const signData = async (signer, data) => {
  const api = await getPolkaApiForAccount(signer)
  const signature = await api.sign(signer, { data: u8aToHex(stringToU8a(data)) })
  return signature
}

export const transfer = async (url, sender, amount, decimals, receiver, assetId) => {
  const api = await getPolkaApiForAccount(sender, url)

  return new Promise((resolve, reject) => {
    api.tx.rioAssets.transfer(assetId, receiver, String((new Decimal(amount)).times(Math.pow(10, decimals))), '').signAndSend(sender).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const withdraw = async (url, sender, amount, decimals, assetId, receiver, memo, onUpdate) => {
  const api = await getPolkaApiForAccount(sender, url)

  const finalReceiver = receiver.startsWith('0x') ? receiver.substring(2) : receiver

  return new Promise((resolve, reject) => {
    api.tx.rioGateway.requestWithdraw(assetId, String((new Decimal(amount)).times(Math.pow(10, decimals))), finalReceiver, memo || '').signAndSend(sender, (result) => {
      if (result.status.isInBlock) {
        onUpdate(String(result.status.asInBlock))
      } else if (result.status.isFinalized) {
        resolve(result)
      }
    }).then((cancel) => {
      console.log(cancel)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const approveWithdraw = async (url, sender, withdrawId, onUpdate) => {
  const api = await getPolkaApiForAccount(sender, url)

  return new Promise((resolve, reject) => {
    api.tx.rioGateway.approveWithdraw(withdrawId).signAndSend(sender, (result) => {
      if (result.status.isInBlock) {
        onUpdate(String(result.status.asInBlock))
      } else if (result.status.isFinalized) {
        resolve(result)
      }
    }).then((cancel) => {
      console.log(cancel)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const modifyWithdrawState = async (url, sender, withdrawId, state, onUpdate) => {
  const api = await getPolkaApiForAccount(sender, url)

  return new Promise((resolve, reject) => {
    api.tx.rioGateway.modifyWithdrawState(withdrawId, state).signAndSend(sender, (result) => {
      if (result.status.isInBlock) {
        onUpdate(String(result.status.asInBlock))
      } else if (result.status.isFinalized) {
        resolve(result)
      }
    }).then((cancel) => {
      console.log(cancel)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const rebroadcastWithdraw = async (url, sender, withdrawId, txHash, onUpdate) => {
  const api = await getPolkaApiForAccount(sender, url)

  return new Promise((resolve, reject) => {
    api.tx.rioGateway.rebroadcast(withdrawId, txHash).signAndSend(sender, (result) => {
      if (result.status.isInBlock) {
        onUpdate(String(result.status.asInBlock))
      } else if (result.status.isFinalized) {
        resolve(result)
      }
    }).then((cancel) => {
      console.log(cancel)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const rejectWithdraw = async (url, sender, withdrawId, onUpdate) => {
  const api = await getPolkaApiForAccount(sender, url)

  return new Promise((resolve, reject) => {
    api.tx.rioGateway.rejectWithdraw(withdrawId).signAndSend(sender, (result) => {
      if (result.status.isInBlock) {
        onUpdate(String(result.status.asInBlock))
      } else if (result.status.isFinalized) {
        resolve(result)
      }
    }).then((cancel) => {
      console.log(cancel)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const revokeWithdraw = async (url, sender, withdrawId, onUpdate) => {
  const api = await getPolkaApiForAccount(sender, url)

  return new Promise((resolve, reject) => {
    api.tx.rioGateway.revokeWithdraw(withdrawId).signAndSend(sender, (result) => {
      if (result.status.isInBlock) {
        onUpdate(String(result.status.asInBlock))
      } else if (result.status.isFinalized) {
        resolve(result)
      }
    }).then((cancel) => {
      console.log(cancel)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const finishWithdraw = async (url, sender, withdrawId, txHash, onUpdate) => {
  const api = await getPolkaApiForAccount(sender, url)

  return new Promise((resolve, reject) => {
    api.tx.rioGateway.withdrawFinish(withdrawId, txHash).signAndSend(sender, (result) => {
      if (result.status.isInBlock) {
        onUpdate(String(result.status.asInBlock))
      } else if (result.status.isFinalized) {
        resolve(result)
      }
    }).then((cancel) => {
      console.log(cancel)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const applyDepositAddress = async (sender) => {
  const api = await getPolkaApiForAccount(sender)

  return new Promise((resolve, reject) => {
    api.tx.rioGateway.applyDepositIndex().signAndSend(sender, (result) => {
      if (result.status.isInBlock) {
        // resolve(result)
      } else if (result.status.isFinalized) {
        console.log('applyDepositAddress', String(result.status.asFinalized))
        resolve(result)
      }
    }).then((cancel) => {
      console.log(cancel)
    }).catch((error) => {
      reject(error)
    })
  })
}

const network_mainnet = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
}

const network_testnet = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'tb',
  bip32: {
    public: 0x044a5262,
    private: 0x0488ade4, // need confirm
  },
  pubKeyHash: 111,
  scriptHash: 196,
  wif: 239,
}

export const deriveHdAddress = async (xpub, path, index, isTestNet) => {
  const network = isTestNet ? network_testnet : network_mainnet
  console.log(path)
  const node = bip32.fromBase58(xpub, network)
  return node.derivePath(`0/${index}`).publicKey
}

export const deriveCreate2Address = async (creatorAddress, implementationAddress, vaultAddress, salt) => {
  return precalculate(creatorAddress, implementationAddress, vaultAddress, salt)
}

// todo  xbc ~


export const getBalance = async (address,decimals,contract) => {

  if (address && decimals) {

    const api = await polkaApi()
    let balanceData, lockBalanceData;
    const hanleBalance = (data) => {
      if (data) {
        const dataObj = JSON.parse(String(data));
        const {free} = dataObj || {}

        let balance = 0
        if (free) {
          balance = Number(free) / Math.pow(10, decimals)
        }
        if ((dataObj || {}).data) {
          const {free : rFefulFree} = dataObj.data
          balance = Number(rFefulFree) / Math.pow(10, decimals)
        }
        return balance
      }
    }
    if (!isNaN(contract) && contract) {
      balanceData = await api.query.rioAssets.accounts(address, contract)
      const hanleBalance = (data) => data ? Number(JSON.parse(String(data)).free) / Math.pow(10, decimals) : ''
    } else {
      balanceData = await api.query.system.account(address)
      // todo lock balance remove
      // lockBalanceData = await api.query.rioAssets.accounts(address, 1)
    }

    const freeBalance = hanleBalance(balanceData)
    console.log('freeBalance:',freeBalance)
      // todo lock balance remove
    // const lockBalance = hanleBalance(lockBalanceData)

    return freeBalance
    // return {freeBalance,lockBalance}
  }
  return freeBalance
  // return {freeBalance:0,lockBalance:0}
}

export const rioTransfer = async ({sender,receiver,assetId,amount,decimals},onUpdate,onSuccess, onError) => {
  const api = await polkaApi()
  const result = await api.tx.currencies.transfer(receiver, assetId, String((new Decimal(amount)).times(Math.pow(10, decimals)))).signAndSend(sender)
  return String(result)
  // , (result) => {
  //   if (result.status.isInBlock) {
  //     onUpdate(String(result.status.asInBlock))
  //   } else if (result.status.isFinalized) {
  //     onSuccess()
  //   }
  // }).then(cancel => {

  //   }).catch( error => {
  //       onError(error)
  //   })
}