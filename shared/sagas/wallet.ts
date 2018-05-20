import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/wallet'
import { getBalanceRequested } from 'actions/balance'
import { getErrorMessage, encodeKey, encodeKeyStoreKey } from 'utils'
import secureStorage from 'utils/secureStorage'
import {
  initAccount,
  privateToPublic,
  generateMasterKeys,
  deriveKeys,
  getEOS,
  getLocalAccounts,
  isValidPrivate
} from 'eos'
import * as bip32 from 'bip32'
import bip38 from 'bip38'
import * as bip39 from 'bip39'
import * as bip44 from 'bip44'
import * as wif from 'wif'
import { createHash, createHmac } from 'crypto'

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
  yield call(secureStorage.setItem, encodeKey('activeAccount'), name)
  yield call(secureStorage.setItem, encodeKey('accountList'), accountList, true)
  yield call(secureStorage.setItem, encodeKeyStoreKey(name, 'auth'), key)
}

function* createAccountRequested(action: Action<CreateAccountParams>) {
  if (!action.payload) return

  try {
    const bitportalAccountName = action.payload.bitportalAccountName
    const password = action.payload.password
    const eosAccountName = action.payload.eosAccountName

    console.log(bitportalAccountName)
    console.log(password)
    console.log(eosAccountName)

    const phrase = await bip39.generateMnemonic()
    console.log(phrase)
    const seed = bip39.mnemonicToSeedHex(phrase)
    console.log(seed)

    const root = bip32.fromMasterSeed(new Buffer(seed, 'hex'))
    const path = bip44.getBIP44Path({ symbol: 'EOS' })
    console.log(path)

    const eosPrivateKey = root.derive(path).privateKey
    console.log(eosPrivateKey.toString('hex'))
    const eosWIF = wif.encode(0x80, eosPrivateKey)
    console.log('master', eosWIF)
    console.log(isValidPrivate(eosWIF))

    // const eosEncrypted = bip38.encrypt(eosPrivateKey, false, password)
    // console.log(eosEncrypted)

    const eosOwnerPrivateKey = createHash('sha256').update(eosPrivateKey).update('owner').digest()
    console.log(eosOwnerPrivateKey.toString('hex'))
    const eosOwnerWIF = wif.encode(0x80, eosOwnerPrivateKey)
    console.log('onwer', eosOwnerWIF)
    console.log(isValidPrivate(eosOwnerWIF))
    const eosOwnerPublicKey = await privateToPublic(eosOwnerPrivateKey)
    console.log(eosOwnerPublicKey)

    const eosActivePrivateKey = createHash('sha256').update(eosOwnerPrivateKey).update('active').digest()
    console.log(eosActivePrivateKey.toString('hex'))
    const eosActiveWIF = wif.encode(0x80, eosActivePrivateKey)
    console.log('active', eosActiveWIF)
    console.log(isValidPrivate(eosActiveWIF))
    const eosActivePublicKey = await privateToPublic(eosActivePrivateKey)
    console.log(eosActivePublicKey)

    // yield put(actions.createAccountSucceeded())
  } catch (e) {
    console.log(e)
    yield put(actions.createAccountFailed(getErrorMessage(e)))
  }
}

function* createEOSAccountRequested(action: Action<CreateEOSAccountParams>) {
  if (!action.payload) return

  try {
    const creator = action.payload.creator
    const name = action.payload.name
    const recovery = action.payload.recovery
    let keyProvider
    let owner
    let active
    let importedPrivateKey

    const keys = yield call(generateMasterKeys, 'PW5J8iaJZ8u42Jdcti9mfbeJwp3uRJbb3a8jaQKNd4GbiSrC1HLou')
    console.log(keys)
    importedPrivateKey = keys.masterPrivateKey
    owner = keys.publicKeys.owner
    active = keys.publicKeys.active
    keyProvider = keys.privateKeys.active

    const { eos } = yield call(initAccount, { name, keyProvider })

    yield call(eos.newaccount, { creator, name, owner, active, recovery })

    yield put(actions.createEOSAccountSucceeded({ name, key: importedPrivateKey }))
  } catch (e) {
    console.log(e)
    yield put(actions.createEOSAccountFailed(getErrorMessage(e)))
  }
}

function* createEOSAccountSucceeded(action: Action<CreateEOSAccountResult>) {
  if (!action.payload) return

  const name = action.payload.name
  const key = action.payload.key
  yield call(saveEOSAccountToDisk, name, key)
  yield put(actions.syncEOSAccount())
}

function* switchEOSAccount(action: Action<SwitchEOSAccountParams>) {
  if (!action.payload) return

  const name = action.payload.name
  yield call(initAccount, { name })
  yield call(secureStorage.setItem, encodeKey('activeAccount'), name)
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
  const key = yield call(secureStorage.getItem, encodeKeyStoreKey(name, 'auth'))
  yield put(actions.authEOSAccountRequested({ key, account: action.payload }))
}

function* authEOSAccountRequested(action: Action<AuthEOSAccountParams>) {
  if (!action.payload) return

  try {
    const key = action.payload.key
    const account = action.payload.account
    const permissions = account.permissions

    yield call(deriveKeys, {
      parent: key,
      saveKeyMatches: ['active'],
      accountPermissions: permissions
    })
    yield put(actions.authEOSAccountSucceeded(account))
  } catch (e) {
    yield put(actions.authEOSAccountFailed(getErrorMessage(e)))
  }
}

function* authEOSAccountSucceeded(action: Action<AuthEOSAccountResult>) {
  if (!action.payload) return

  const code = 'eosiox.token'
  const account = action.payload.account_name
  // const symbol = 'EOS'
  yield put(getBalanceRequested({ code, account }))
}

function* setEOSAccountPassword(action: Action<SetEOSAccountPasswordParams>) {
  if (!action.payload) return

  const name = action.payload.name
  const password = action.payload.password
  yield call(secureStorage.setItem, encodeKey(name), password)
}

function* syncEOSAccount() {
  let activeAccount = yield call(secureStorage.getItem, encodeKey('activeAccount'))
  const accountList = yield call(getLocalAccounts)

  if (!accountList || !accountList.length) return
  if (!activeAccount) activeAccount = accountList[0]

  yield put(actions.syncEOSAccountSucceeded({ activeAccount, accountList }))
}

function* syncEOSAccountSucceeded(action: Action<SyncEOSAccountResult>) {
  if (!action.payload) return

  const name = action.payload.activeAccount
  yield put(actions.switchEOSAccount({ name }))
}

function* importEOSAccountRequested(action: Action<ImportEOSAccountParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.name
    const key = action.payload.key
    const { eos } = yield call(initAccount, { name, keyProvider: key })
    const account = yield call(eos.getAccount, name)
    yield call(deriveKeys, {
      parent: key,
      saveKeyMatches: ['owner', 'active'],
      accountPermissions: account.permissions
    })
    yield call(saveEOSAccountToDisk, name, key)
    yield put(actions.importEOSAccountSucceeded(account))
  } catch (e) {
    console.log(e)
    yield put(actions.importEOSAccountFailed(getErrorMessage(e)))
  }
}

function* importEOSAccountSucceeded() {
  yield put(actions.syncEOSAccount())
}

function* importEOSAccountFailed() {
  yield put(actions.syncEOSAccount())
}

function* clearAccount() {
  const prefix = encodeKey()
  const allItems = yield call(secureStorage.getAllItems)

  for (const key of Object.keys(allItems)) {
    if (key.indexOf(prefix) === 0) {
      yield call(secureStorage.removeItem, key)
    }
  }
}

export default function* walletSaga() {
  yield takeEvery(String(actions.createAccountRequested), createAccountRequested)
  yield takeEvery(String(actions.createEOSAccountRequested), createEOSAccountRequested)
  yield takeEvery(String(actions.createEOSAccountSucceeded), createEOSAccountSucceeded)
  yield takeEvery(String(actions.importEOSAccountRequested), importEOSAccountRequested)
  yield takeEvery(String(actions.importEOSAccountSucceeded), importEOSAccountSucceeded)
  yield takeEvery(String(actions.importEOSAccountFailed), importEOSAccountFailed)
  yield takeEvery(String(actions.getEOSAccountRequested), getEOSAccountRequested)
  yield takeEvery(String(actions.getEOSAccountSucceeded), getEOSAccountSucceeded)
  yield takeEvery(String(actions.authEOSAccountRequested), authEOSAccountRequested)
  yield takeEvery(String(actions.authEOSAccountSucceeded), authEOSAccountSucceeded)
  yield takeEvery(String(actions.switchEOSAccount), switchEOSAccount)
  yield takeEvery(String(actions.setEOSAccountPassword), setEOSAccountPassword)
  yield takeEvery(String(actions.syncEOSAccount), syncEOSAccount)
  yield takeEvery(String(actions.syncEOSAccountSucceeded), syncEOSAccountSucceeded)
  yield takeEvery(String(actions.clearAccount), clearAccount)
}
