import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import assert from 'assert'
import * as actions from 'actions/keystore'
import { getErrorMessage, encodeKey } from 'utils'
import secureStorage from 'utils/secureStorage'
import { isValidPrivate, privateToPublic } from 'eos'
import { getMasterSeed } from 'key'

function* importEOSKeyRequested(action: Action<ImportEOSKeyParams>) {
  if (!action.payload) return

  try {
    const privateKey = action.payload.key
    const walletId = action.payload.walletId
    const coin = 'EOS'
    assert(isValidPrivate(privateKey), 'Invalid EOS private key!')
    const publicKey = yield call(privateToPublic, privateKey)
    let publicKeys = yield call(secureStorage.getItem, encodeKey('public keys'), true)
    assert(typeof publicKeys !== 'string', 'EOS public keys should not be string!')

    if (!publicKeys) {
      publicKeys = [{ publicKey, hdWalletName, coin }]
    } else {
      const existedKey = publicKeys.filter(item => item.publicKey === publicKey)
      assert(!existedKey.length, 'Public key has been imported!')
      publicKeys.push({ publicKey, walletId, coin })
    }

    yield call(secureStorage.setItem, encodeKey('public keys'), publicKeys, true)
    yield put(actions.importEOSKeySucceeded({ publicKey, walletId, coin }))
  } catch (e) {
    yield put(actions.importEOSKeyFailed(getErrorMessage(e)))
  }
}

function* syncKeyRequested() {
  try {
    let publicKeys = yield call(secureStorage.getItem, encodeKey('public keys'), true)
    if (!publicKeys || !publicKeys.length) publicKeys = []
    yield put(actions.syncKeySucceeded(publicKeys))
  } catch (e) {
    console.log(e)
    yield put(actions.syncKeyFailed(getErrorMessage(e)))
  }
}

export default function* keySaga() {
  yield takeEvery(String(actions.importEOSKeyRequested), importEOSKeyRequested)
  yield takeEvery(String(actions.syncKeyRequested), syncKeyRequested)
}
