import assert from 'assert'
import Eos from 'eosjs'
import { EOS_API_URL } from 'constants/env'
import { EOS_TESTNET_NODES, EOS_MAINNET_CHAIN_ID, EOS_TESTNET_CHAIN_ID } from 'constants/chain'
import storage from 'utils/storage'

const ecc = Eos.modules.ecc
let eos: any

const initEOS = async (options: any) => {
  const eosNodeInfo = await storage.getItem('bitportal_eosNode', true)
  const eosNode = options.httpEndpoint || (eosNodeInfo && eosNodeInfo.activeNode) || EOS_API_URL
  const isTestNet = ~EOS_TESTNET_NODES.indexOf(eosNode)
  const defaultChainId = isTestNet ? EOS_TESTNET_CHAIN_ID : EOS_MAINNET_CHAIN_ID
  const chainId = options.chainId || defaultChainId
  const httpEndpoint = eosNode
  eos = Eos({ ...options, chainId, httpEndpoint })
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

const sortProducers = (a: any, b: any) => parseInt(Eos.modules.format.encodeName(a, false), 10) - parseInt(Eos.modules.format.encodeName(b, false), 10)

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

const getInitialAccountInfo = (eosAccountName: string, publicKey: string) => (
  {
    account_name: eosAccountName,
    core_liquid_balance: '0.0000 EOS',
    cpu_limit: { used: 0, available: 0, max: 0 },
    cpu_weight: 0,
    net_limit: { used: 0, available: 0, max: 0 },
    net_weight: 0,
    permissions: [
      {
        parent: 'owner',
        perm_name: 'active',
        required_auth: {
          accounts: [],
          keys: [{ key: publicKey, weight: 1 }],
          threshold: 1,
          waits: []
        }
      },
      {
        parent: '',
        perm_name: 'owner',
        required_auth: {
          accounts: [],
          keys: [{ key: publicKey, weight: 1 }],
          threshold: 1,
          waits: []
        }
      }
    ],
    privileged: false,
    ram_quota: 0,
    ram_usage: 0,
    refund_request: null,
    self_delegated_bandwidth: null,
    total_resources: {
      owner: eosAccountName,
      cpu_weight: '0.0000 EOS',
      net_weight: '0.0000 EOS',
      ram_bytes: 0
    },
    voter_info: null
  }
)

export {
  initEOS,
  getEOS,
  privateToPublic,
  isValidPrivate,
  randomKey,
  getProducers,
  sortProducers,
  getPermissionsByKey,
  getInitialAccountInfo
}
