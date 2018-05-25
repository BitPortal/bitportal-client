import assert from 'assert'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import { Navigation } from 'react-native-navigation'
import { reset } from 'redux-form/immutable'
import * as actions from 'actions/eosAccount'
import { getBalanceRequested } from 'actions/balance'
import { getErrorMessage } from 'utils'
import secureStorage from 'utils/secureStorage'
import { initAccount, getEOS } from 'eos'
import { getMasterSeedFromEntropy, getEOSKeys, decrypt, validateEntropy } from 'key'

function* createEOSAccountRequested(action: Action<CreateEOSAccountParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.eosName
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
		method: 'pop',
		params: {}
	  }
    })
  } catch (e) {
    yield put(actions.createEOSAccountFailed(getErrorMessage(e)))
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
  // yield takeEvery(String(actions.createEOSAccountSucceeded), createEOSAccountSucceeded)
  // yield takeEvery(String(actions.getEOSAccountRequested), getEOSAccountRequested)
  // yield takeEvery(String(actions.getEOSAccountSucceeded), getEOSAccountSucceeded)
  // yield takeEvery(String(actions.authEOSAccountRequested), authEOSAccountRequested)
  // yield takeEvery(String(actions.authEOSAccountSucceeded), authEOSAccountSucceeded)
  // yield takeEvery(String(actions.syncEOSAccount), syncEOSAccount)
  // yield takeEvery(String(actions.syncEOSAccountSucceeded), syncEOSAccountSucceeded)
}
