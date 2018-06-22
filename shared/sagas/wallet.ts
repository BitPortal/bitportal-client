import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import { Navigation } from 'react-native-navigation'
import { reset } from 'redux-form/immutable'
import assert from 'assert'
import * as actions from 'actions/wallet'
import { resetEOSAccount } from 'actions/eosAccount'
import { resetBalance, getBalanceRequested } from 'actions/balance'
import { resetKey } from 'actions/keystore'
import { syncEOSAccount, createEOSAccountSucceeded } from 'actions/eosAccount'
import { getErrorMessage } from 'utils'
import secureStorage from 'utils/secureStorage'
import { privateToPublic, initAccount, randomKey, initEOS } from 'eos'
import { getMasterSeed, encrypt, decrypt, getEOSKeys, getEOSWifsByInfo } from 'key'
import wif from 'wif'

function* createWalletAndEOSAccountRequested(action: Action<CreateWalletAndEOSAccountParams>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const name = action.payload.name
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const origin = action.payload.origin || 'classic'

    if (origin === 'classic') {
      const existedAccount = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
      assert(!existedAccount, 'EOS account already exists!')

      const ownerWif = yield call(randomKey)
      const activeWif = ownerWif
      const ownerPrivateKey = wif.decode(ownerWif).privateKey.toString('hex')
      const activePrivateKey = ownerPrivateKey

      const creator = 'eosio'
      const keyProvider = [
        'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
        '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
      ]
      const owner = yield call(privateToPublic, ownerWif)
      const active = yield call(privateToPublic, activeWif)

      const signProvider = ({ sign, buf }: { sign: any, buf: any }) => sign(buf, '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3')
      const { eos } = yield call(initAccount, { keyProvider, signProvider })
      const transactionActions = (transaction: any) => {
        transaction.newaccount({ name: eosAccountName, creator, owner, active })
        transaction.buyrambytes({ payer: creator, receiver: eosAccountName, bytes: 8192 })
        transaction.delegatebw({
          from: creator,
          receiver: eosAccountName,
          stake_net_quantity: '1.0000 SYS',
          stake_cpu_quantity: '1.0000 SYS',
          transfer: 0
        })
      }
      yield call(eos.transaction, transactionActions)
      const accountInfo = yield call(eos.getAccount, eosAccountName)
      const info = { ...accountInfo, timestamp: +Date.now() }

      const ownerKeystore = yield call(encrypt, ownerPrivateKey, password, { origin: 'classic', coin: 'EOS' })
      const activeKeystore = yield call(encrypt, activePrivateKey, password, { origin: 'classic', coin: 'EOS' })
      const walletInfo = {
        coin: 'EOS',
        timestamp: +Date.now(),
        origin,
        name,
        eosAccountName
      }

      yield call(secureStorage.setItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_OWNER_${owner}`, ownerKeystore, true)
      yield call(secureStorage.setItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_ACTIVE_${active}`, activeKeystore, true)
      yield call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, info, true)
      yield call(secureStorage.setItem, `CLASSIC_WALLET_INFO_EOS_${eosAccountName}`, walletInfo, true)
      yield call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)

      yield put(createEOSAccountSucceeded(info))
      yield put(actions.createHDWalletSucceeded(walletInfo))
      yield put(getBalanceRequested({ code: 'eosio.token', account: walletInfo.eosAccountName }))
    } else {
      const { id, entropy } = yield call(getMasterSeed)
      const existedWallet = yield call(secureStorage.getItem, `HD_KEYSTORE_${id}`, true)
      assert(!existedWallet, 'Wallet already exists!')
      const keystore = yield call(encrypt, entropy, password, { bpid: id })

      const walletInfo = {
        bpid: id,
        timestamp: +Date.now(),
        origin,
        name,
        eosAccountName
      }

      const eosKeys = yield call(getEOSKeys, entropy)
      assert(eosKeys, 'Generate EOS keys failed!')
      const creator = 'eosio'
      const keyProvider = [
        'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
        '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
      ]
      const owner = eosKeys.keys.owner.publicKey
      const active = eosKeys.keys.active.publicKey

      const signProvider = ({ sign, buf }: { sign: any, buf: any }) => sign(buf, '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3')
      const { eos } = yield call(initAccount, { keyProvider, signProvider })
      const transactionActions = (transaction: any) => {
        transaction.newaccount({ name: eosAccountName, creator, owner, active })
        transaction.buyrambytes({ payer: creator, receiver: eosAccountName, bytes: 8192 })
        transaction.delegatebw({
          from: creator,
          receiver: eosAccountName,
          stake_net_quantity: '1.0000 SYS',
          stake_cpu_quantity: '1.0000 SYS',
          transfer: 0
        })
      }
      yield call(eos.transaction, transactionActions)
      const accountInfo = yield call(eos.getAccount, eosAccountName)
      const info = { ...accountInfo, bpid: id, timestamp: +Date.now() }

      yield call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, info, true)
      yield call(secureStorage.setItem, `HD_KEYSTORE_${id}`, keystore, true)
      yield call(secureStorage.setItem, `HD_WALLET_INFO_${id}`, walletInfo, true)
      yield call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)

      yield put(createEOSAccountSucceeded(info))
      yield put(actions.createHDWalletSucceeded(walletInfo))
      yield put(getBalanceRequested({ code: 'eosio.token', account: walletInfo.eosAccountName }))
    }

    yield put(reset('createWalletAndEOSAccountForm'))
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
    const { id, entropy } = yield call(getMasterSeed)
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
    // const items = yield call(secureStorage.getAllItems)
    // console.log(items)
    const eos = yield call(initEOS, {})
    console.log(eos)

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

    let active = allItems.ACTIVE_WALLET && JSON.parse(allItems.ACTIVE_WALLET)

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
    if (active.eosAccountName) {
      yield put(getBalanceRequested({ code: 'eosio.token', account: active.eosAccountName }))
    }
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

function* logoutRequested(action: Action<LogoutParams>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const origin = action.payload.origin
    const bpid = action.payload.bpid
    const coin = action.payload.coin

    assert(origin, 'No origin!')

    if (origin === 'hd') {
      const keystore = yield call(secureStorage.getItem, `HD_KEYSTORE_${bpid}`, true)
      yield call(decrypt, keystore, password)
    } else if (coin === 'EOS') {
      const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
      yield call(getEOSWifsByInfo, password, accountInfo, ['owner', 'active'])
    }

    const items = yield call(secureStorage.getAllItems)
    for (const item of Object.keys(items)) {
      yield call(secureStorage.removeItem, item)
    }

    yield put(actions.resetWallet())
    yield put(resetEOSAccount())
    yield put(resetBalance())
    yield put(resetKey())
    yield put(actions.logoutSucceeded())
    Navigation.handleDeepLink({
      link: '*',
      payload: {
        method: 'popToRoot',
        params: {}
      }
    })
  } catch (e) {
    yield put(actions.logoutFailed(getErrorMessage(e)))
  }
}

export default function* walletSaga() {
  yield takeEvery(String(actions.createWalletRequested), createWalletRequested)
  yield takeEvery(String(actions.createWalletAndEOSAccountRequested), createWalletAndEOSAccountRequested)
  yield takeEvery(String(actions.syncWalletRequested), syncWalletRequested)
  yield takeEvery(String(actions.switchWalletRequested), switchWalletRequested)
  yield takeEvery(String(actions.logoutRequested), logoutRequested)
}
