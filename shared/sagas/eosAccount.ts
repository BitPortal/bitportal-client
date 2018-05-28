import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import { Navigation } from 'react-native-navigation'
import { reset } from 'redux-form/immutable'
import * as actions from 'actions/eosAccount'
import { getBalanceRequested } from 'actions/balance'
import { createClassicWalletSucceeded } from 'actions/wallet'
import { getErrorMessage } from 'utils'
import secureStorage from 'utils/secureStorage'
import { initAccount, getEOS, privateToPublic, isValidPrivate } from 'eos'
import { getEOSKeys, decrypt, validateEntropy, encrypt } from 'key'
import wif from 'wif'

function* createEOSAccountRequested(action: Action<CreateEOSAccountParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.eosAccountName
    const bpid = action.payload.bpid
    const keystore = yield call(secureStorage.getItem, `HD_KEYSTORE_${bpid}`, true)
    assert(keystore, 'Wallet dose not exist!')
    const password = action.payload.password
    const entropy = yield call(decrypt, keystore, password)
    assert(validateEntropy(entropy), 'Invalid entropy!')
    const eosKeys = yield call(getEOSKeys, entropy)
    assert(eosKeys, 'Generate EOS keys failed!')
    const creator = 'eosio'
    const recovery = 'eosio'
    const keyProvider = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
    const owner = eosKeys.keys.owner.publicKey
    const active = eosKeys.keys.active.publicKey

    const { eos } = yield call(initAccount, { keyProvider })
    yield call(eos.newaccount, { creator, name, owner, active, recovery })
    const accountInfo = yield call(eos.getAccount, name)
    const info = { ...accountInfo, bpid, timestamp: +Date.now() }
    yield call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${name}`, info, true)
    yield put(actions.createEOSAccountSucceeded(info))
    yield put(reset('createWalletForm'))
    Navigation.handleDeepLink({
	  link: '*',
	  payload: {
		method: 'popToRoot',
		params: {}
	  }
    })
  } catch (e) {
    yield put(actions.createEOSAccountFailed(getErrorMessage(e)))
  }
}

function* importEOSAccountRequested(action: Action<ImportEOSAccountParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.name
    const eosAccountName = action.payload.eosAccountName
    const ownerPrivateKey = action.payload.ownerPrivateKey
    const activePrivateKey = action.payload.activePrivateKey
    const password = action.payload.password
    assert(isValidPrivate(ownerPrivateKey), 'Invalid owner private key!')
    assert(isValidPrivate(activePrivateKey), 'Invalid active private key!')
    const ownerPublicKey = yield call(privateToPublic, ownerPrivateKey)
    const activePublicKey = yield call(privateToPublic, activePrivateKey)

    const { eos } = yield call(initAccount, { keyProvider: [ownerPrivateKey, activePrivateKey] })
    const accountInfo = yield call(eos.getAccount, eosAccountName)
    assert(accountInfo.permissions && accountInfo.permissions.length, 'EOS account dose not exist!')
    const permissions = accountInfo.permissions
    const remoteOwnerPermission = permissions.filter(item => item.perm_name === 'owner')
    assert(remoteOwnerPermission.length && remoteOwnerPermission[0].required_auth && remoteOwnerPermission[0].required_auth.keys && remoteOwnerPermission[0].required_auth.keys.length, 'Owner permission dose not exist!')
    const remoteActivePermission = permissions.filter(item => item.perm_name === 'active')
    assert(remoteActivePermission.length && remoteActivePermission[0].required_auth && remoteActivePermission[0].required_auth.keys && remoteActivePermission[0].required_auth.keys.length, 'Active permission dose not exist!')
    const ownerPublicKeyMatched = !!remoteOwnerPermission[0].required_auth.keys.filter(item => item.key === ownerPublicKey).length
    assert(ownerPublicKeyMatched, 'Unauthorized owner private key!')
    const activePublicKeyMatched = !!remoteActivePermission[0].required_auth.keys.filter(item => item.key === activePublicKey).length
    assert(activePublicKeyMatched, 'Unauthorized active private key!')

    const ownerPrivateKeyDecodedString = wif.decode(ownerPrivateKey).privateKey.toString('hex')
    const activePrivateKeyDecodedString = wif.decode(activePrivateKey).privateKey.toString('hex')

    const existedAccount = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    assert(!existedAccount, 'EOS account already exists!')

    const ownerKeystore = yield call(encrypt, ownerPrivateKeyDecodedString, password, { origin: 'classic', coin: 'EOS' })
    const activeKeystore = yield call(encrypt, activePrivateKeyDecodedString, password, { origin: 'classic', coin: 'EOS' })
    const walletInfo = {
      coin: 'EOS',
      timestamp: +Date.now(),
      origin: 'classic',
      name,
      eosAccountName
    }
    const info = { ...accountInfo, timestamp: +Date.now() }

    yield call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, info, true)
    yield call(secureStorage.setItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_OWNER_${ownerPublicKey}`, ownerKeystore, true)
    yield call(secureStorage.setItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_ACTIVE_${activePublicKey}`, activeKeystore, true)
    yield call(secureStorage.setItem, `CLASSIC_WALLET_INFO_EOS_${eosAccountName}`, walletInfo, true)
    yield call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)
    yield put(actions.importEOSAccountSucceeded(info))
    yield put(createClassicWalletSucceeded(walletInfo))

    yield put(reset('importEOSAccountForm'))
    Navigation.handleDeepLink({
	  link: '*',
	  payload: {
		method: 'popToRoot',
		params: {}
	  }
    })
  } catch (e) {
    yield put(actions.importEOSAccountFailed(getErrorMessage(e)))
  }
}

// function* createEOSAccountSucceeded(action: Action<CreateEOSAccountResult>) {
//   if (!action.payload) return

//   const name = action.payload.name
//   const key = action.payload.key
//   yield call(saveEOSAccountToDisk, name, key)
//   yield put(actions.syncEOSAccount())
// }

// function* getEOSAccountRequested(action: Action<CreateEOSAccountParams>) {
//   if (!action.payload) return

//   try {
//     const eos = getEOS()
//     const data = yield call(eos.getAccount, action.payload.name)
//     yield put(actions.getEOSAccountSucceeded(data))
//   } catch (e) {
//     yield put(actions.getEOSAccountFailed(getErrorMessage(e)))
//   }
// }

// function* getEOSAccountSucceeded(action: Action<GetEOSAccountResult>) {
//   if (!action.payload) return

//   const name = action.payload.account_name
//   const key = yield call(secureStorage.getItem, encodeKeyStoreKey(name, 'auth'))
//   yield put(actions.authEOSAccountRequested({ key, account: action.payload }))
// }

// function* authEOSAccountRequested(action: Action<AuthEOSAccountParams>) {
//   if (!action.payload) return

//   try {
//     const key = action.payload.key
//     const account = action.payload.account
//     const permissions = account.permissions

//     yield call(deriveKeys, {
//       parent: key,
//       saveKeyMatches: ['active'],
//       accountPermissions: permissions
//     })
//     yield put(actions.authEOSAccountSucceeded(account))
//   } catch (e) {
//     yield put(actions.authEOSAccountFailed(getErrorMessage(e)))
//   }
// }

// function* authEOSAccountSucceeded(action: Action<AuthEOSAccountResult>) {
//   if (!action.payload) return

//   const code = 'eosiox.token'
//   const account = action.payload.account_name
//   // const symbol = 'EOS'
//   yield put(getBalanceRequested({ code, account }))
// }

// function* syncEOSAccount() {
//   let activeAccount = yield call(secureStorage.getItem, encodeKey('activeAccount'))
//   const accountList = yield call(getLocalAccounts)

//   if (!accountList || !accountList.length) return
//   if (!activeAccount) activeAccount = accountList[0]

//   yield put(actions.syncEOSAccountSucceeded({ activeAccount, accountList }))
// }

// function* syncEOSAccountSucceeded(action: Action<SyncEOSAccountResult>) {
//   if (!action.payload) return

//   const name = action.payload.activeAccount
//   yield put(actions.switchEOSAccount({ name }))
// }

// function* importEOSAccountRequested(action: Action<ImportEOSAccountParams>) {
//   if (!action.payload) return

//   try {
//     const name = action.payload.name
//     const key = action.payload.key
//     const { eos } = yield call(initAccount, { name, keyProvider: key })
//     const account = yield call(eos.getAccount, name)
//     yield call(deriveKeys, {
//       parent: key,
//       saveKeyMatches: ['owner', 'active'],
//       accountPermissions: account.permissions
//     })
//     yield put(actions.importEOSAccountSucceeded(account))
//   } catch (e) {
//     console.log(e)
//     yield put(actions.importEOSAccountFailed(getErrorMessage(e)))
//   }
// }

export default function* eosAccountSaga() {
  yield takeEvery(String(actions.createEOSAccountRequested), createEOSAccountRequested)
  yield takeEvery(String(actions.importEOSAccountRequested), importEOSAccountRequested)
  // yield takeEvery(String(actions.getEOSAccountRequested), getEOSAccountRequested)
  // yield takeEvery(String(actions.getEOSAccountSucceeded), getEOSAccountSucceeded)
  // yield takeEvery(String(actions.authEOSAccountRequested), authEOSAccountRequested)
  // yield takeEvery(String(actions.authEOSAccountSucceeded), authEOSAccountSucceeded)
  // yield takeEvery(String(actions.syncEOSAccount), syncEOSAccount)
  // yield takeEvery(String(actions.syncEOSAccountSucceeded), syncEOSAccountSucceeded)
}
