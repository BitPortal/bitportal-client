import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import { Navigation } from 'react-native-navigation'
import { reset } from 'redux-form/immutable'
import assert from 'assert'
import * as actions from 'actions/wallet'
import { getErrorMessage, encodeKey } from 'utils'
import secureStorage from 'utils/secureStorage'
import bip39 from 'react-native-bip39'
import { isValidPrivate, privateToPublic } from 'eos'
import { getMasterSeed, encrypt, decrypt, getEOSKeys } from 'key'

function* createWalletRequested(action: Action<CreateWalletParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.name
    const password = action.payload.password
    const { id, phrase, entropy } = yield call(getMasterSeed)
    console.log('entropy', entropy)
    const existedWallet = yield call(secureStorage.getItem, `HD_KEYSTORE_${id}`, true)
    assert(!existedWallet, 'Wallet already exists!')
    const keystore = yield call(encrypt, entropy, password, { bpid: id })
    const walletInfo = {
      bpid: id,
      timestamp: +Date.now(),
      name
    }

    yield call(secureStorage.setItem, `HD_KEYSTORE_${id}`, keystore, true)
    yield call(secureStorage.setItem, `HD_WALLET_INFO_${id}`, walletInfo, true)
    yield call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)
    yield put(actions.createWalletSucceeded(walletInfo))
    yield put(reset('createWalletForm'))
    // yield call(delay, 2000)
    Navigation.handleDeepLink({
	  link: '*',
	  payload: {
		method: 'push',
		params: {
          screen: 'BitPortal.EOSAccountCreation'
        }
	  }
    })
  } catch (e) {
    console.log(e)
    yield put(actions.createWalletFailed(getErrorMessage(e)))
  }
}

function* syncWalletRequested() {
  try {
    // yield call(secureStorage.removeItem, 'EOS_ACCOUNT_INFO_222222')
    const items = yield call(secureStorage.getAllItems)
    console.log(items)

    const allItems = yield call(secureStorage.getAllItems)
    const hdWalletList = Object.keys(allItems).filter(item => !item.indexOf('HD_KEYSTORE')).map(item => {
      const id = item.slice('HD_KEYSTORE'.length + 1)
      const infoKey = `HD_WALLET_INFO_${id}`
      const info = allItems[infoKey]
      return JSON.parse(info)
    }).sort((a, b) => a.timestamp - b.timestamp)

    assert(hdWalletList.length, 'No wallets!')

    const active = allItems.ACTIVE_WALLET && JSON.parse(allItems.ACTIVE_WALLET)
    if (!active) {
      active = hdWalletList[0]
      yield call(secureStorage.setItem, 'ACTIVE_WALLET', active, true)
    }

    yield put(actions.syncWalletSucceeded({ hdWalletList, active }))
  } catch (e) {
    yield put(actions.syncWalletFailed(getErrorMessage(e)))
  }
}

function* switchWalletRequested(action: Action<HDWallet>) {
  if (!action.payload) return

  try {
    const name = action.payload.name
    const bpid = action.payload.bpid
    const timestamp = action.payload.timestamp

    yield call(secureStorage.setItem, 'ACTIVE_WALLET', { name, bpid, timestamp }, true)
    yield put(actions.switchWalletSucceeded({ name, bpid, timestamp }))
  } catch (e) {
    yield put(actions.switchWalletFailed(getErrorMessage(e)))
  }
}

export default function* walletSaga() {
  yield takeEvery(String(actions.createWalletRequested), createWalletRequested)
  yield takeEvery(String(actions.syncWalletRequested), syncWalletRequested)
  yield takeEvery(String(actions.switchWalletRequested), switchWalletRequested)
}
