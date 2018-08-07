import assert from 'assert'
import Eos from 'react-native-eosjs'
import { EOS_API_URL } from 'constants/env'
import { EOS_TESTNET_NODES, EOS_MAINNET_CHAIN_ID, EOS_TESTNET_CHAIN_ID } from 'constants/chain'
import storage from 'utils/storage'

const ecc = Eos.modules.ecc
let eos: any

const initEOS = async (options: any) => {
  const storeInfo = await storage.getItem('bitportal.activeNode', true)
  const eosNode = storeInfo && storeInfo.activeNode
  const isTestNet = ~EOS_TESTNET_NODES.indexOf(eosNode)
  const defaultChainId = isTestNet ? EOS_TESTNET_CHAIN_ID : EOS_MAINNET_CHAIN_ID
  const chainId = options.chainId || defaultChainId
  eos = Eos({ ...options, chainId, httpEndpoint: eosNode || EOS_API_URL })
  return eos
}

const getEOS = () => {
  return eos
}

const randomKey = async () => {
  const privateKey = await ecc.randomKey()
  return privateKey
}

const privateToPublic = async (privateKey: string) => {
  const keys = await ecc.privateToPublic(privateKey)
  return keys
}

const isValidPrivate = (privateKey: string) => ecc.isValidPrivate(privateKey)

const getProducers = (params: any) => {
  alert(JSON.stringify(params))
  return new Promise((resolve) => {
    eos.getProducers(params).then((result: any) => {
      return resolve(result)
    })
  })
}

const sortProducers = (a: any, b: any) => parseInt(Eos.modules.format.encodeName(a, false)) - parseInt(Eos.modules.format.encodeName(b, false))

const getPermissionsByKey = (publickKey: string, accountInfo: any) => {
  assert(accountInfo.permissions && accountInfo.permissions.length, 'EOS account permissions dose not exist!')
  assert(accountInfo.account_name, 'EOS account name dose not exist!')
  const permissions = accountInfo.permissions
  const eosAccountName = accountInfo.account_name
  const balance = accountInfo.core_liquid_balance ? accountInfo.core_liquid_balance.split(' ')[0] : 0
  const roles = permissions.filter((permission: any) => permission.required_auth && permission.required_auth.keys.filter((key: any) => key && key.key === publickKey).length).map((permission: any) => ({ balance, accountInfo, accountName: eosAccountName, permission: permission.perm_name }))
  const ownerPermission = roles.filter((role: any) => role.permission === 'owner')
  return ownerPermission.length ? ownerPermission : roles
}

export {
  initEOS,
  getEOS,
  privateToPublic,
  isValidPrivate,
  randomKey,
  getProducers,
  sortProducers,
  getPermissionsByKey
}
