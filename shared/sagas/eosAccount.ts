import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import { reset } from 'redux-form/immutable'
import * as actions from 'actions/eosAccount'
import { getBalanceRequested } from 'actions/balance'
import { createClassicWalletSucceeded } from 'actions/wallet'
import secureStorage from 'utils/secureStorage'
import { randomKey, privateToPublic, isValidPrivate, initEOS, getPermissionsByKey } from 'core/eos'
import { getEOSKeys, decrypt, validateEntropy, encrypt } from 'core/key'
import { getErrorMessage } from 'utils'
import { popToRoot, push } from 'utils/location'
import * as api from 'utils/api'
import wif from 'wif'

function* createEOSAccountRequested(action: Action<CreateEOSAccountParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const hint = action.payload.hint
    const inviteCode = action.payload.inviteCode
    let privateKey = action.payload.privateKey

    if (privateKey) {
      assert(isValidPrivate(privateKey), 'Invalid private key')
    } else {
      privateKey = yield call(randomKey)
    }

    const publicKey = yield call(privateToPublic, privateKey)

    console.log({
      inviteCode,
      chainType: 'eos',
      walletId: eosAccountName,
      ownerKey: publicKey,
      activeKey: publicKey
    })

    const result = yield call(api.createEOSAccount, {
      inviteCode,
      chainType: 'eos',
      walletId: eosAccountName,
      ownerKey: publicKey,
      activeKey: publicKey
    })

    console.log(result)
    // const accountInfo = yield call(eos.getAccount, eosAccountName)
    // const info = { ...accountInfo, bpid, timestamp: +Date.now() }
    // yield call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, info, true)
    // yield put(actions.createEOSAccountSucceeded(info))
    // yield put(reset('createWalletForm'))
    // if (action.payload.componentId) popToRoot(action.payload.componentId)
  } catch (e) {
    console.log(e)
    yield put(actions.createEOSAccountFailed(getErrorMessage(e)))
  }
}

function* importEOSAccountRequested(action: Action<ImportEOSAccountParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.name
    const eosAccountName = action.payload.eosAccountName
    const publicKey = action.payload.publicKey
    const privateKey = action.payload.privateKey
    const password = action.payload.password
    const accountInfo = action.payload.accountInfo
    const permission = action.payload.permission.toUpperCase()

    const privateKeyDecodedString = wif.decode(privateKey).privateKey.toString('hex')
    const keystore = yield call(encrypt, privateKeyDecodedString, password, { origin: 'classic', coin: 'EOS' })
    const walletInfo = {
      name,
      eosAccountName,
      permission,
      coin: 'EOS',
      timestamp: +Date.now(),
      origin: 'classic'
    }
    const info = accountInfo

    yield call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, info, true)
    yield call(secureStorage.setItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_${permission}_${publicKey}`, keystore, true)
    yield call(secureStorage.setItem, `CLASSIC_WALLET_INFO_EOS_${eosAccountName}`, walletInfo, true)
    yield call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)
    yield put(actions.importEOSAccountSucceeded(info))
    yield put(createClassicWalletSucceeded(walletInfo))
    yield put(getBalanceRequested({ code: 'eosio.token', account: walletInfo.eosAccountName }))

    yield put(reset('importEOSAccountForm'))
    if (action.payload.componentId) popToRoot(action.payload.componentId)
  } catch (e) {
    yield put(actions.importEOSAccountFailed(getErrorMessage(e)))
  }
}

function* getEOSKeyAccountsRequested(action: Action<GetEOSKeyAccountsParams>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const privateKey = action.payload.privateKey
    const password = action.payload.password
    const hint = action.payload.hint
    assert(password, 'Invalid password!')
    assert(isValidPrivate(privateKey), 'Invalid private key!')
    const publicKey = yield call(privateToPublic, privateKey)
    const eos = yield call(initEOS, {})
    assert(eos.getKeyAccounts, 'No eos getKeyAccounts method')
    const result = yield call(eos.getKeyAccounts, { public_key: publicKey })
    assert(result.account_names && result.account_names.length, 'No key accounts')
    const keyAccounts = result.account_names
    let keyPermissions = []

    for (accountName of keyAccounts) {
      const accountInfo = yield call(eos.getAccount, accountName)
      const permissions = getPermissionsByKey(publicKey, accountInfo)
      keyPermissions = [...keyPermissions, ...permissions]
    }

    yield put(actions.getEOSKeyAccountsSucceeded(result))
    if (action.payload.componentId) push('BitPortal.AccountSelection', action.payload.componentId, { keyPermissions, publicKey, privateKey, password, hint })
  } catch (e) {
    yield put(actions.getEOSKeyAccountsFailed(getErrorMessage(e)))
  }
}

function* getEOSAccountRequested(action: Action<GetEOSAccountParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const eos = yield call(initEOS, {})
    assert(eos.getAccount, 'No eos getAccount method')
    const info = yield call(eos.getAccount, eosAccountName)
    assert(info && info.account_name, 'Invalid account info')
    yield put(actions.getEOSAccountSucceeded(info))
    yield call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, info, true)
  } catch (e) {
    yield put(actions.getEOSAccountFailed(e.message))
  }
}

function* validateEOSAccountRequested(action: Action<ValidateEOSAccountParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.value
    const resolve = action.payload.resolve
    const eos = yield call(initEOS, {})
    assert(eos.getAccount, 'No eos getAccount method')
    const info = yield call(eos.getAccount, eosAccountName)
    assert(info && info.account_name, 'Invalid account info')
    yield put(actions.validateEOSAccountSucceeded({ resolve }))
  } catch (e) {
    const { reject, field, errorMessage } = action.payload
    yield put(actions.validateEOSAccountFailed({ reject, field, message: errorMessage }))
  }
}

function validateEOSAccountSucceeded(action: Action<ValidateEOSAccountResult>) {
  if (!action.payload) return
  const resolve = action.payload.resolve
  resolve()
}

function validateEOSAccountFailed(action: Action<ValidateEOSAccountRejection>) {
  if (!action.payload) return
  const reject = action.payload.reject
  const field = action.payload.field
  const message = action.payload.message
  reject({ [field]: message })
}

export default function* eosAccountSaga() {
  yield takeEvery(String(actions.createEOSAccountRequested), createEOSAccountRequested)
  yield takeEvery(String(actions.importEOSAccountRequested), importEOSAccountRequested)
  yield takeEvery(String(actions.getEOSAccountRequested), getEOSAccountRequested)
  yield takeEvery(String(actions.validateEOSAccountRequested), validateEOSAccountRequested)
  yield takeEvery(String(actions.validateEOSAccountSucceeded), validateEOSAccountSucceeded)
  yield takeEvery(String(actions.validateEOSAccountFailed), validateEOSAccountFailed)
  yield takeEvery(String(actions.getEOSKeyAccountsRequested), getEOSKeyAccountsRequested)
}
