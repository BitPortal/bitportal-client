import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/wallet'
import { getErrorMessage, encodeKey } from 'utils'
import secureStorage from 'utils/secureStorage'
import {
  initAccount,
  privateToPublic,
  generateMasterKeys,
  deriveKeys,
  getEOS,
  getLocalAccounts
} from 'eos'

function* saveEOSAccountToDisk(name: string, key: string) {
  let accountList
  const accountListFromProperty = yield call(secureStorage.getItem, encodeKey('accountList'), true)
  const accountListFromStorage = yield call(getLocalAccounts)

  if (accountListFromProperty && !!accountListFromProperty.length) {
    accountList = accountListFromProperty
  } else if (!!accountListFromStorage.length) {
    accountList = accountListFromStorage
  } else {
    accountList = []
  }

  accountList.push(name)
  yield call(secureStorage.setItem, encodeKey('accountList'), accountList, true)
  yield call(secureStorage.setItem, encodeKey(name, 'auth'), key)
}

function* createEOSAccountRequested(action: Action<CreateEOSAccountParams>) {
  if (!action.payload) return

  try {
    const creator = action.payload.creator
    const name = action.payload.name
    const recovery = action.payload.recovery
    let keyProvider = action.payload.keyProvider
    let owner
    let active
    let importedPrivateKey

    if (keyProvider) {
      importedPrivateKey = keyProvider
      owner = yield call(privateToPublic, importedPrivateKey)
      active = yield call(privateToPublic, importedPrivateKey)
    } else {
      const keys = yield call(generateMasterKeys)
      importedPrivateKey = keys.masterPrivateKey
      owner = keys.publicKeys.owner
      active = keys.publicKeys.active
      keyProvider = keys.privateKeys.active
    }

    const { eos } = yield call(initAccount, { name, keyProvider })

    yield call(eos.newaccount, { creator, name, owner, active, recovery })

    yield put(actions.createEOSAccountSucceeded({ name, key: importedPrivateKey }))
  } catch (e) {
    yield put(actions.createEOSAccountFailed(getErrorMessage(e)))
  }
}

function* createEOSAccountSucceeded(action: Action<CreateEOSAccountResult>) {
  if (!action.payload) return

  const name = action.payload.name
  const key = action.payload.key
  yield call(saveEOSAccountToDisk, name, key)
  yield put(actions.switchEOSAccount({ name }))
}

function* switchEOSAccount(action: Action<SwitchEOSAccountParams>) {
  if (!action.payload) return

  const name = action.payload.name
  yield call(initAccount, { name })
  yield put(actions.getEOSAccountRequested({ name }))
}

function* getEOSAccountRequested(action: Action<CreateEOSAccountParams>) {
  if (!action.payload) return

  try {
    const eos = getEOS()
    const data = yield call(eos.getAccount, action.payload.name)
    yield put(actions.getEOSAccountSucceeded(data))
  } catch (e) {
    yield put(actions.getEOSAccountFailed(getErrorMessage(e)))
  }
}

function* getEOSAccountSucceeded(action: Action<GetEOSAccountResult>) {
  if (!action.payload) return

  const name = action.payload.account_name
  const permissions = action.payload.permissions
  const key = yield call(secureStorage.getItem, encodeKey(name, 'auth'))
  yield put(actions.authEOSAccountRequested({ key, permissions }))
}

function* authEOSAccountRequested(action: Action<AuthEOSAccountParams>) {
  if (!action.payload) return

  try {
    const key = action.payload.key
    const permissions = action.payload.permissions

    yield call(deriveKeys, {
      parent: key,
      saveKeyMatches: ['owner', 'active'],
      accountPermissions: permissions
    })
    yield put(actions.authEOSAccountSucceeded())
  } catch (e) {
    yield put(actions.authEOSAccountFailed(getErrorMessage(e)))
  }
}

export default function* walletSaga() {
  yield takeEvery(String(actions.createEOSAccountRequested), createEOSAccountRequested)
  yield takeEvery(String(actions.createEOSAccountSucceeded), createEOSAccountSucceeded)
  yield takeEvery(String(actions.getEOSAccountRequested), getEOSAccountRequested)
  yield takeEvery(String(actions.getEOSAccountSucceeded), getEOSAccountSucceeded)
  yield takeEvery(String(actions.authEOSAccountRequested), authEOSAccountRequested)
  yield takeEvery(String(actions.switchEOSAccount), switchEOSAccount)
}
