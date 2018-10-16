import assert from 'assert'
import Eos from 'eosjs'
import { EOS_API_URL } from 'constants/env'
import { EOS_TESTNET_NODES, EOS_MAINNET_CHAIN_ID, EOS_TESTNET_CHAIN_ID } from 'constants/chain'
import storage from 'utils/storage'
import secureStorage from 'utils/secureStorage'
import { getEOSWifsByInfo } from 'core/key'

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
  // const ownerPermission = roles.filter((role: any) => role.permission === 'owner')
  // return ownerPermission.length ? ownerPermission : roles
  return roles
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

const voteEOSProducers = async ({ eosAccountName, password, permission, producers, proxy }: VoteEOSProducersParams) => {
  assert(eosAccountName, 'No EOS account exist!')

  const accountInfo = await secureStorage.getItem(`EOS_ACCOUNT_INFO_${eosAccountName}`, true)
  const _permission = permission || 'ACTIVE'
  const wifs = await getEOSWifsByInfo(password, accountInfo, [_permission])
  const keyProvider = wifs.map((item: any) => item.wif)
  const sortedProducers = producers.sort(sortProducers)

  const eos = await initEOS({ keyProvider })
  const data = await eos.transaction({
    actions: [{
      account: 'eosio',
      name: 'voteproducer',
      authorization: [{
        actor: eosAccountName,
        permission: _permission.toLowerCase()
      }],
      data: {
        voter: eosAccountName,
        producers: sortedProducers,
        proxy: proxy || ''
      }
    }],
    broadcast: false,
    sign: true
  })

  return data
}

const transferEOSAsset = async ({
  fromAccount,
  toAccount,
  amount,
  symbol,
  precision,
  memo,
  password,
  contract,
  permission
}: TransferEOSAssetParams) => {
  assert(contract, 'No contract!')
  const _precision = precision || 4
  const quantity = `${(+amount).toFixed(_precision)} ${symbol}`
  const _permission = permission || 'ACTIVE'
  const accountInfo = await secureStorage.getItem(`EOS_ACCOUNT_INFO_${fromAccount}`, true)
  const wifs = await getEOSWifsByInfo(password, accountInfo, [_permission])
  const keyProvider = wifs.map((item: any) => item.wif)
  const eos = await initEOS({ keyProvider })
  const data = await eos.transaction({
    actions: [{
      account: contract,
      name: 'transfer',
      authorization: [{
        actor: fromAccount,
        permission: _permission.toLowerCase()
      }],
      data: {
        quantity,
        memo: memo || '',
        from: fromAccount,
        to: toAccount
      }
    }],
    broadcast: false,
    sign: true
  })

  return data
}

const pushEOSAction = async ({
  account,
  actions,
  password,
  permission
}: PushEOSActionParams) => {
  const _permission = permission || 'ACTIVE'
  const accountInfo = await secureStorage.getItem(`EOS_ACCOUNT_INFO_${account}`, true)
  const wifs = await getEOSWifsByInfo(password, accountInfo, [_permission])
  const keyProvider = wifs.map((item: any) => item.wif)
  const eos = await initEOS({ keyProvider })
  const data = await eos.transaction({
    actions,
    broadcast: false,
    sign: true
  })
  return data
}

const eosAuthSign = async ({
  account,
  publicKey,
  password,
  signData,
  isHash
}: SignEOSDataParams) => {
  const accountInfo = await secureStorage.getItem(`EOS_ACCOUNT_INFO_${account}`, true)
  const wifs = await getEOSWifsByInfo(password, accountInfo, ['OWNER', 'ACTIVE'])
  const keyProvider = wifs.filter((item: any) => item.publicKey === publicKey).map((item: any) => item.wif)
  const wif = keyProvider[0]
  return isHash ? ecc.Signature.signHash(signData, wif).toString() : ecc.sign(Buffer.from(signData, 'utf8'), wif)
}

const signature = async ({
  account,
  publicKey,
  password,
  buf
}: SignatureParams) => {
  const accountInfo = await secureStorage.getItem(`EOS_ACCOUNT_INFO_${account}`, true)
  const wifs = await getEOSWifsByInfo(password, accountInfo, ['OWNER', 'ACTIVE'])
  const keyProvider = wifs.filter((item: any) => item.publicKey === publicKey).map((item: any) => item.wif)
  const wif = keyProvider[0]
  return [ecc.sign(Buffer.from(buf.data, 'utf8'), wif)]
}

const verify = async ({
  account,
  permission,
  password,
  signature,
  data,
  publicKey
}: VerifyParams) => {
  const _permission = permission || 'ACTIVE'
  const accountInfo = await secureStorage.getItem(`EOS_ACCOUNT_INFO_${account}`, true)
  const wifs = await getEOSWifsByInfo(password, accountInfo, [_permission])
  const keyProvider = wifs.filter((item: any) => item.publicKey === publicKey).map((item: any) => item.wif)
  const wif = keyProvider[0]
  return ecc.verify(signature, data, wif)
}

export {
  initEOS,
  getEOS,
  privateToPublic,
  isValidPrivate,
  randomKey,
  getProducers,
  sortProducers,
  getPermissionsByKey,
  getInitialAccountInfo,
  voteEOSProducers,
  transferEOSAsset,
  pushEOSAction,
  eosAuthSign,
  signature,
  verify
}
