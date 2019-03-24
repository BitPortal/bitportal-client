import assert from 'assert'
import storage from 'core/storage/localStorage'
import * as walletCore from 'core/wallet'
import { eos, ecc, eosFormat, initEOS } from 'core/api'

export const privateToPublic = async (privateKey: string) => {
  const publicKey = await ecc.privateToPublic(privateKey)
  return publicKey
}

export const isValidPrivate = (privateKey: string) => ecc.isValidPrivate(privateKey)

export const getProducers = (params: any) => {
  return new Promise((resolve) => {
    eos.getProducers(params).then((result: any) => {
      return resolve(result)
    })
  })
}

export const sortProducers = (a: any, b: any) => parseInt(eosFormat.encodeName(a, false), 10) - parseInt(eosFormat.encodeName(b, false), 10)

export const getPermissionsByKey = (publickKey: string, accountInfo: any) => {
  assert(accountInfo.permissions && accountInfo.permissions.length, 'EOS account permissions dose not exist!')
  assert(accountInfo.account_name, 'EOS account name dose not exist!')
  const permissions = accountInfo.permissions
  const eosAccountName = accountInfo.account_name
  const balance = accountInfo.core_liquid_balance ? accountInfo.core_liquid_balance.split(' ')[0] : 0
  const roles = permissions.filter((permission: any) => permission.required_auth && permission.required_auth.keys.filter((key: any) => key && key.key === publickKey).length).map((permission: any) => permission.perm_name)
  // const ownerPermission = roles.filter((role: any) => role.permission === 'owner')
  // return ownerPermission.length ? ownerPermission : roles
  return { balance, accountInfo, accountName: eosAccountName, permissions: roles }
}

export const getEOSKeyAccountsByPublicKey = async (publicKey: string) => {
  assert(eos.getKeyAccounts, 'No getKeyAccounts function')

  const keyAccounts = await eos.getKeyAccounts({ public_key: publicKey })
  assert(typeof keyAccounts === 'object' && keyAccounts.account_names && typeof keyAccounts.account_names === 'object' && keyAccounts.account_names.length > 0, 'No key accounts')

  let keyPermissions = []
  for (const accountName of keyAccounts.account_names) {
    const accountInfo = await eos.getAccount(accountName)
    const permissions = getPermissionsByKey(publicKey, accountInfo)
    keyPermissions = [...keyPermissions, permissions]
  }

  return keyPermissions
}

export const getEOSKeyAccountsByPrivateKey = async (privateKey: string) => {
  assert(isValidPrivate(privateKey), 'Invalid private key')
  const publicKey = await ecc.privateToPublic(privateKey)

  assert(eos.getKeyAccounts, 'No getKeyAccounts function')
  const keyAccounts = await eos.getKeyAccounts({ public_key: publicKey })
  assert(typeof keyAccounts === 'object' && keyAccounts.account_names && typeof keyAccounts.account_names === 'object' && keyAccounts.account_names.length > 0, 'No key accounts')

  let keyPermissions = []
  for (const accountName of keyAccounts.account_names) {
    const accountInfo = await eos.getAccount(accountName)
    const permissions = getPermissionsByKey(publicKey, accountInfo)
    keyPermissions = [...keyPermissions, permissions]
  }

  return keyPermissions
}

export const getEOSPermissionKeyPairs = async (keyPairs: any, accountName: string, permissions?: any) => {
  const accountPermissions = permissions || (await getAccount(accountName)).permissions
  const publicKeys = keyPairs.map((pair: any) => pair.publicKey)
  const permissionKeys = accountPermissions
    .map((permission: any) => ({
      name: permission.perm_name,
      keys: permission.required_auth.keys.filter((keyObject: any) => publicKeys.indexOf(keyObject.key) !== -1)
    }))
    .filter((permission: any) => permission.keys.length > 0)
    .map((permission: any) => ({
      ...permission,
      keys: permission.keys.map((keyObject: any) => {
        const keyPair = keyPairs.find((keyPair: string) => keyPair.publicKey === keyObject.key)
        return {
          publicKey: keyObject.key,
          privateKey: keyPair.privateKey,
          weight: keyObject.weight
        }
      })
    }))
  return permissionKeys
}


export const getActivePermissionPublicKeyPair = async (permissionKeys: any) => {
  const permissions = permissionKeys.map((permissionKey: any) => permissionKey.name)
  let activePermissionPublicKeyPair

  if (permissions.indexOf('active') !== -1) {
    activePermissionPublicKeyPair = permissionKeys.find((permissionKey: any) => permissionKey.name === 'active')
  } else if (permissions.indexOf('owner') !== -1) {
    activePermissionPublicKeyPair = permissionKeys.find((permissionKey: any) => permissionKey.name === 'owner')
  } else {
    activePermissionPublicKeyPair = permissionKeys[0]
  }

  return {
    permission: activePermissionPublicKeyPair.name,
    publicKey: activePermissionPublicKeyPair.keys[0].publicKey
  }
}

export const getEOSPermissionPublicKeyPairs = async (publicKeys: any, accountName: string, permissions?: any) => {
  const accountPermissions = permissions || (await getAccount(accountName)).permissions
  const permissionKeys = accountPermissions
    .map((permission: any) => ({
      name: permission.perm_name,
      keys: permission.required_auth.keys.filter((keyObject: any) => publicKeys.indexOf(keyObject.key) !== -1)
    }))
    .filter((permission: any) => permission.keys.length > 0)
    .map((permission: any) => ({
      ...permission,
      keys: permission.keys.map((keyObject: any) => {
        const keyPair = publicKeys.find((publicKey: string) => publicKey === keyObject.key)
        return {
          publicKey: keyObject.key,
          weight: keyObject.weight
        }
      })
    }))
  return permissionKeys
}

export const getBalance = async (accountName: string, contract?: string, symbol?: string) => {
  const code = contract || 'eosio.token'
  const result = await eos.getCurrencyBalance({ code, account: accountName })

  assert(typeof result === 'object' && result.length > 0 && result[0] && typeof result[0] === 'string', 'Invalid eos balance result')

  const balance = result[0].split(' ')[0]
  const resultSymbol = result[0].split(' ')[1]
  const precision = balance.split('.')[1].length
  return { balance, symbol: resultSymbol, precision, contract: code }
}

export const getAccount = async (accountName: string) => {
  const result = await eos.getAccount(accountName)
  return result
}

export const getContract = async (contractName: string) => {
  const result = await eos.contract(contractName)
  return result
}

export const selectKeysForPermission = async (keyPairs: any, account: string, permissions: any, permission?: string) => {
  let permissionKey
  const permissionKeys = await getEOSPermissionKeyPairs(keyPairs, account, permissions)
  assert(permissionKeys && permissionKeys.length, 'No private key for permissions')

  if (permission) {
    permissionKey = permissionKeys.find((item: any) => item.name === permission)
    assert(permissionKey, 'No private key for permission')
  } else {
    const activePermissionKey = permissionKeys.find((item: any) => item.name === 'active')

    permissionKey = activePermissionKey ? activePermissionKey : permissionKeys[0]
  }

  return {
    name: permissionKey.name,
    keys: permissionKey.keys.map((item: any) => item.privateKey)
  }
}

export const getTransactions = async (accountName: string, position: number = 0, offset: number = 1000) => {
  const result = await eos.getActions({ offset, account_name: accountName, pos: position })
  return result
}

export const getTransaction = async (hash: string) => {
  const result = await eos.getTransaction({ id: hash })
  return result
}

export const transfer = async (
  password: string,
  keystore: any,
  fromAccount: string,
  toAccount: string,
  amount: any,
  symbol: string,
  precision: number,
  memo: any,
  contract: string,
  permissions: any,
  permission?: string
) => {
  assert(contract, 'No contract')
  assert(amount, 'No amount')
  const quantity = `${(+amount).toFixed(precision || 4)} ${symbol}`
  const keyPairs = await walletCore.exportPrivateKeys(password, keystore)
  const permissionKey = await selectKeysForPermission(keyPairs, fromAccount, permissions, permission)
  const keyProvider = permissionKey.keys
  const eos = await initEOS({ keyProvider })
  const data = await eos.transaction({
    actions: [{
      account: contract,
      name: 'transfer',
      authorization: [{
        actor: fromAccount,
        permission: permissionKey.name
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

  return data.transaction_id
}

export const sign = async (
  password: string,
  keystore: any,
  buf: any,
  account: string,
  permissions: any,
  permission?: string
) => {
  const keyPairs = await walletCore.exportPrivateKeys(password, keystore)
  const permissionKey = await selectKeysForPermission(keyPairs, account, permissions, permission)
  const keyProvider = permissionKey.keys
  const wif = keyProvider[0]
  return [ecc.sign(Buffer.from(buf.data, 'utf8'), wif)]
}

export const signData = async (
  password: string,
  keystore: any,
  data: string,
  account: string,
  isHash: boolean,
  permissions: any,
  permission?: string
) => {
  const keyPairs = await walletCore.exportPrivateKeys(password, keystore)
  const permissionKey = await selectKeysForPermission(keyPairs, account, permissions, permission)
  const keyProvider = permissionKey.keys
  const wif = keyProvider[0]
  return isHash ? ecc.Signature.signHash(data, wif).toString() : ecc.sign(Buffer.from(data, 'utf8'), wif)
}
