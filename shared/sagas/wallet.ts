import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import { Navigation } from 'react-native-navigation'
import { reset } from 'redux-form/immutable'
import assert from 'assert'
import * as actions from 'actions/wallet'
import { syncEOSAccount, createEOSAccountSucceeded } from 'actions/eosAccount'
import { getErrorMessage, encodeKey } from 'utils'
import secureStorage from 'utils/secureStorage'
import bip39 from 'react-native-bip39'
import { isValidPrivate, privateToPublic, initAccount } from 'eos'
import { getMasterSeed, encrypt, decrypt, getEOSKeys } from 'key'

function* createWalletAndEOSAccountRequested(action: Action<CreateWalletAndEOSAccountParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.name
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const { id, phrase, entropy } = yield call(getMasterSeed)
    const existedWallet = yield call(secureStorage.getItem, `HD_KEYSTORE_${id}`, true)
    assert(!existedWallet, 'Wallet already exists!')
    const keystore = yield call(encrypt, entropy, password, { bpid: id })
    const walletInfo = {
      bpid: id,
      timestamp: +Date.now(),
      origin: 'hd',
      name
    }

    const eosKeys = yield call(getEOSKeys, entropy)
    assert(eosKeys, 'Generate EOS keys failed!')
    const creator = 'eosio'
    const recovery = 'eosio'
    const keyProvider = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
    const owner = eosKeys.keys.owner.publicKey
    const active = eosKeys.keys.active.publicKey
    const { eos } = yield call(initAccount, { keyProvider })
    yield call(eos.newaccount, { creator, owner, active, recovery, name: eosAccountName })
    const accountInfo = yield call(eos.getAccount, eosAccountName)
    const info = { ...accountInfo, bpid: id, timestamp: +Date.now() }
    yield call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, info, true)

    yield call(secureStorage.setItem, `HD_KEYSTORE_${id}`, keystore, true)
    yield call(secureStorage.setItem, `HD_WALLET_INFO_${id}`, walletInfo, true)
    yield call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)
    yield put(createEOSAccountSucceeded(info))
    yield put(actions.createHDWalletSucceeded(walletInfo))
    yield put(reset('createWalletAndEOSAccountForm'))
    // yield call(delay, 2000)
    Navigation.handleDeepLink({
	  link: '*',
	  payload: {
		method: 'pop'
	  }
    })
  } catch (e) {
    yield put(actions.createWalletFailed(getErrorMessage(e)))
  }
}

function* createWalletRequested(action: Action<CreateWalletParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.name
    const password = action.payload.password
    const { id, phrase, entropy } = yield call(getMasterSeed)
    const existedWallet = yield call(secureStorage.getItem, `HD_KEYSTORE_${id}`, true)
    assert(!existedWallet, 'Wallet already exists!')
    const keystore = yield call(encrypt, entropy, password, { bpid: id })
    const walletInfo = {
      bpid: id,
      timestamp: +Date.now(),
      origin: 'hd',
      name
    }

    yield call(secureStorage.setItem, `HD_KEYSTORE_${id}`, keystore, true)
    yield call(secureStorage.setItem, `HD_WALLET_INFO_${id}`, walletInfo, true)
    yield call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)
    yield put(actions.createHDWalletSucceeded(walletInfo))
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
    yield put(actions.createWalletFailed(getErrorMessage(e)))
  }
}

function* syncWalletRequested() {
  try {
    const items = yield call(secureStorage.getAllItems)
    console.log(items)
    // for (const item of Object.keys(items)) {
    //   yield call(secureStorage.removeItem, item)
    // }

    const allItems = yield call(secureStorage.getAllItems)

    const hdWalletList = Object.keys(allItems).filter(item => !item.indexOf('HD_KEYSTORE')).map(item => {
      const id = item.slice('HD_KEYSTORE'.length + 1)
      const infoKey = `HD_WALLET_INFO_${id}`
      const info = allItems[infoKey]
      return JSON.parse(info)
    }).sort((a, b) => a.timestamp - b.timestamp)

    const classicWalletList = Object.keys(allItems).filter(item => !item.indexOf('CLASSIC_WALLET_INFO_EOS')).map(item => {
      const info = allItems[item]
      return JSON.parse(info)
    }).sort((a, b) => a.timestamp - b.timestamp)

    assert(hdWalletList.length + classicWalletList.length, 'No wallets!')

    const active = allItems.ACTIVE_WALLET && JSON.parse(allItems.ACTIVE_WALLET)

    if (!active) {
      if (hdWalletList.length) {
        active = hdWalletList[0]
      } else {
        active = classicWalletList[0]
      }

      yield call(secureStorage.setItem, 'ACTIVE_WALLET', active, true)
    }

    const eosAccountList = Object.keys(allItems).filter(item => !item.indexOf('EOS_ACCOUNT_INFO')).map(item => {
      const info = allItems[item]
      return JSON.parse(info)
    }).sort((a, b) => a.timestamp - b.timestamp)

    yield put(syncEOSAccount(eosAccountList))
    yield put(actions.syncWalletSucceeded({ hdWalletList, classicWalletList, active }))
  } catch (e) {
    yield put(actions.syncWalletFailed(getErrorMessage(e)))
  }
}

function* switchWalletRequested(action: Action<HDWallet>) {
  if (!action.payload) return

  try {
    yield call(secureStorage.setItem, 'ACTIVE_WALLET', action.payload, true)
    yield put(actions.switchWalletSucceeded(action.payload))
  } catch (e) {
    yield put(actions.switchWalletFailed(getErrorMessage(e)))
  }
}

export default function* walletSaga() {
  yield takeEvery(String(actions.createWalletRequested), createWalletRequested)
  yield takeEvery(String(actions.createWalletAndEOSAccountRequested), createWalletAndEOSAccountRequested)
  yield takeEvery(String(actions.syncWalletRequested), syncWalletRequested)
  yield takeEvery(String(actions.switchWalletRequested), switchWalletRequested)
}
