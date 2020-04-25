import { ApiPromise, WsProvider } from '@polkadot/api'
import Decimal from 'decimal.js'
import { RIO_CHAIN_API } from 'constants/env'
// import { u8aToHex } from 'utils/u8a'
// import { stringToU8a } from 'utils/string'
import chainTypes from './chainTypes'

// 'wss://node.staging.riodefi.com/' '192.168.1.36:9944'
const defaultUrl = RIO_CHAIN_API

const createdApi = {}

export const polkaApi = async (baseUrl) => {
  const url = baseUrl || defaultUrl

  if (createdApi[url]) {
    return createdApi[url]
  }

  const wsProvider = new WsProvider(url)
  const api = await ApiPromise.create({
    provider: wsProvider,
    types: chainTypes
  })
  await api.isReady
  createdApi[url] = api
  return api
}

export const getChainStatus = async (url) => {
  const wsProvider = new WsProvider(url, { autoConnect: false })
  const api = await ApiPromise.create({
    provider: wsProvider,
    types: chainTypes
  })

  const startTime = +Date.now()
  const lastHeader = await api.rpc.chain.getHeader()
  const endTime = +Date.now()

  const delayTime = endTime - startTime
  const blockNumber = Number(lastHeader.number)
  api.disconnect()

  return {
    delayTime,
    blockNumber,
    url
  }
}

const getPolkaApiForAccount = async (sender) => {
  const api = await polkaApi()

  if (typeof sender === 'string') {
    const { web3FromAddress } = await import('@polkadot/extension-dapp'/* webpackChunkName: 'extension-dapp' */)
    const injector = await web3FromAddress(sender)
    api.setSigner(injector.signer)
  }

  return api
}

export const signData = async (signer, data) => {
  const api = await getPolkaApiForAccount(signer)
  const signature = await api.sign(signer, data)
  return signature
}

export const transfer = async (sender, amount, receiver, assetId) => {
  const api = await getPolkaApiForAccount(sender)

  if (assetId) {
    return new Promise((resolve, reject) => {
      api.tx.rioAssets.transfer(assetId, receiver, String((new Decimal(amount)).times(100000000))).signAndSend(sender).then((res) => {
        resolve(res)
      }).catch((error) => {
        reject(error)
      })
    })
  }

  const txHash = await api.tx.balances.transfer(receiver, String((new Decimal(amount)).times(100000000))).signAndSend(sender)
  return txHash
}

export const save = async (sender, amount, sbtcAssetId) => {
  const api = await getPolkaApiForAccount(sender)

  return new Promise((resolve, reject) => {
    api.tx.rioSaving.staking(sbtcAssetId, String((new Decimal(amount)).times(100000000))).signAndSend(sender).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const redeem = async (sender, amount, rscAssetId) => {
  const api = await getPolkaApiForAccount(sender)

  return new Promise((resolve, reject) => {
    api.tx.rioSaving.redeem(rscAssetId, String((new Decimal(amount)).times(100000000))).signAndSend(sender).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const loan = async (sender, btcAmount, rioAmount, packageId) => {
  const api = await getPolkaApiForAccount(sender)

  return new Promise((resolve, reject) => {
    api.tx.rioLoan.apply(String((new Decimal(btcAmount)).times(100000000)), String((new Decimal(rioAmount)).times(100000000)), packageId).signAndSend(sender).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const repay = async (sender, loanId) => {
  const api = await getPolkaApiForAccount(sender)

  return new Promise((resolve, reject) => {
    api.tx.rioLoan.repay(loanId).signAndSend(sender).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const addCollateral = async (sender, loanId, amount) => {
  const api = await getPolkaApiForAccount(sender)

  return new Promise((resolve, reject) => {
    api.tx.rioLoan.addCollateral(loanId, String((new Decimal(amount)).times(100000000))).signAndSend(sender).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

export const draw = async (sender, loanId, amount) => {
  const api = await getPolkaApiForAccount(sender)

  return new Promise((resolve, reject) => {
    api.tx.rioLoan.draw(loanId, String((new Decimal(amount)).times(100000000))).signAndSend(sender).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
