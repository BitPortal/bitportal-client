import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import assert from 'assert'
import * as actions from 'actions/wallet'
import { getErrorMessage, encodeKey } from 'utils'
import secureStorage from 'utils/secureStorage'
import { isValidPrivate, privateToPublic } from 'eos'
import { getMasterSeed } from 'key'

function* createWalletRequested(action: Action<ImportEOSKeyParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.name
    const { phrase, seed, id } = yield call(getMasterSeed)
    console.log('phrase', phrase)
    console.log('seed', seed)

    let wallets = yield call(secureStorage.getItem, encodeKey('wallets'), true)
    assert(typeof wallets !== 'string', 'wallets should not be string!')

    if (!wallets) {
      wallets = [{ name, id }]
    } else {
      const existedWallet = wallets.filter(item => item.id === id)
      assert(!existedWallet.length, 'Wallet has been imported!')
      wallets.push({ name, id })
    }

    yield call(secureStorage.setItem, encodeKey('wallets'), wallets, true)
    yield call(secureStorage.setItem, encodeKey('active wallet'), { name, id }, true)
    yield put(actions.createWalletSucceeded({ name, id }))
  } catch (e) {
    yield put(actions.createWalletFailed(getErrorMessage(e)))
  }
}

function* syncWalletRequested() {
  try {
    let wallets = yield call(secureStorage.getItem, encodeKey('wallets'), true)
    assert(wallets, 'No wallets!')
    assert(typeof wallets !== 'string', 'wallets should not be string!')
    if (!wallets) wallets = []

    let active = yield call(secureStorage.getItem, encodeKey('active wallet'), true)
    if (!active) {
      if (!wallets.length) {
        active = wallets[0]
      } else {
        active = {}
      }
    }

    yield put(actions.syncWalletSucceeded({ wallets, active }))
    // yield call(secureStorage.removeItem, encodeKey('wallets'))
    // yield call(secureStorage.removeItem, encodeKey('active wallet'))
  } catch (e) {
    yield put(actions.syncWalletFailed(getErrorMessage(e)))
  }
}

export default function* walletSaga() {
  yield takeEvery(String(actions.createWalletRequested), createWalletRequested)
  yield takeEvery(String(actions.syncWalletRequested), syncWalletRequested)
}
