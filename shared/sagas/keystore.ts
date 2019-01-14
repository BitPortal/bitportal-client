import { delay } from 'redux-saga'
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import assert from 'assert'
import * as actions from 'actions/keystore'
import { completeBackup } from 'actions/eosAccount'
import { getErrorMessage, encodeKey } from 'utils'
import secureStorage from 'utils/secureStorage'
import { encrypt, getEOSWifsByInfo } from 'core/key'
import { isValidPrivate, privateToPublic } from 'core/legacy/eos'
import { push, pop } from 'utils/location'
import wif from 'wif'

function* importEOSKeyRequested(action: Action<ImportEOSKeyParams>) {
  if (!action.payload) return

  try {
    const privateKey = action.payload.key
    const walletId = action.payload.walletId
    const hdWalletName = action.payload.hdWalletName
    const coin = 'EOS'
    assert(isValidPrivate(privateKey), 'Invalid EOS private key!')
    const publicKey = yield call(privateToPublic, privateKey)
    let publicKeys = yield call(secureStorage.getItem, encodeKey('public keys'), true)
    assert(typeof publicKeys !== 'string', 'EOS public keys should not be string!')

    if (!publicKeys) {
      publicKeys = [{ publicKey, hdWalletName, coin }]
    } else {
      const existedKey = publicKeys.filter((item: any) => item.publicKey === publicKey)
      assert(!existedKey.length, 'Public key has been imported!')
      publicKeys.push({ publicKey, walletId, coin })
    }

    // yield call(secureStorage.setItem, encodeKey('public keys'), publicKeys, true)
    yield put(actions.importEOSKeySucceeded({ publicKey, walletId, coin }))
  } catch (e) {
    yield put(actions.importEOSKeyFailed(getErrorMessage(e)))
  }
}

function* changePasswordRequested(action: Action<ChangePasswordParams>) {
  if (!action.payload) return

  try {
    const oldPassword = action.payload.oldPassword
    const newPassword = action.payload.newPassword
    assert(oldPassword, 'Please input old password!')
    assert(newPassword, 'Please input new password!')

    let wifs = []

    const eosAccountName = action.payload.eosAccountName
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'OWNER')
    assert(permission, 'No permission!')
    wifs = yield call(getEOSWifsByInfo, oldPassword, accountInfo, [permission])
    assert(wifs.length, 'No EOS private keys!')

    for (const wifInfo of wifs) {
      const permission = wifInfo.permission
      const privateKey = wifInfo.wif
      const publicKey = yield call(privateToPublic, privateKey)
      const privateKeyDecodedString = wif.decode(privateKey).privateKey.toString('hex')
      const keystore = yield call(encrypt, privateKeyDecodedString, newPassword, { origin: 'classic', coin: 'EOS' })
      yield call(secureStorage.setItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_${permission}_${publicKey}`, keystore, true)
    }

    yield put(actions.changePasswordSucceeded())
    if (action.payload.componentId) pop(action.payload.componentId)
  } catch (e) {
    yield put(actions.changePasswordFailed(getErrorMessage(e)))
  }
}

function* exportEOSKeyRequested(action: Action<ExportEOSKeyParams>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    assert(password, 'Please input password!')
    const origin = action.payload.origin
    assert(origin, 'Missing origin!')
    assert(origin === 'classic', 'Only support classic origin now!')

    let wifs = []

    if (origin === 'hd') {
      // ...
    } else {
      const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
      const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
      assert(permission, 'No permission!')
      wifs = yield call(getEOSWifsByInfo, password, accountInfo, [permission])
    }

    assert(wifs.length, 'No EOS private keys!')

    let entry
    const eosAccountCreationInfo = yield select((state: RootState) => state.eosAccount.get('eosAccountCreationInfo'))
    if (eosAccountCreationInfo.get('eosAccountName') === eosAccountName && !eosAccountCreationInfo.get('backup')) {
      const newEOSAccountCreationInfo = eosAccountCreationInfo.set('backup', true).toJS()
      yield call(secureStorage.setItem, `EOS_ACCOUNT_CREATION_INFO_${eosAccountName}`, newEOSAccountCreationInfo, true)
      yield put(completeBackup())
      entry = 'backup'
    }

    yield put(actions.exportEOSKeySucceeded())
    if (action.payload.componentId) push('BitPortal.ExportPrivateKey', action.payload.componentId, { wifs, entry })
  } catch (e) {
    yield put(actions.exportEOSKeyFailed(getErrorMessage(e)))
  }
}

function* syncKeyRequested() {
  try {
    let publicKeys = yield call(secureStorage.getItem, encodeKey('public keys'), true)
    if (!publicKeys || !publicKeys.length) publicKeys = []
    yield put(actions.syncKeySucceeded(publicKeys))
  } catch (e) {
    yield put(actions.syncKeyFailed(getErrorMessage(e)))
  }
}

export default function* keySaga() {
  yield takeEvery(String(actions.importEOSKeyRequested), importEOSKeyRequested)
  yield takeEvery(String(actions.exportEOSKeyRequested), exportEOSKeyRequested)
  yield takeEvery(String(actions.changePasswordRequested), changePasswordRequested)
  yield takeEvery(String(actions.syncKeyRequested), syncKeyRequested)
}
