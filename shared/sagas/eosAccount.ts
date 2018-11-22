import assert from 'assert'
import { all, select, call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import { reset } from 'redux-form/immutable'
import * as actions from 'actions/eosAccount'
import { getEOSBalanceSucceeded, setActiveAsset, getEOSAssetBalanceSucceeded } from 'actions/balance'
import { createClassicWalletSucceeded } from 'actions/wallet'
import { traceImport } from 'actions/trace'
import { setSelected } from 'actions/producer'
import { votedProducersSelector, eosCoreLiquidBalanceSelector, eosAccountNameSelector } from 'selectors/eosAccount'
import secureStorage from 'utils/secureStorage'
import { BITPORTAL_API_EOS_URL, EOS_API_URL } from 'constants/env'
import {
  randomKey,
  privateToPublic,
  isValidPrivate,
  initEOS,
  getPermissionsByKey,
  getInitialAccountInfo,
  createEOSAccount
} from 'core/eos'
import { encrypt, validateEOSPublicKeyByInfo } from 'core/key'
import { getErrorMessage, getEOSErrorMessage } from 'utils'
import { popToRoot, push } from 'utils/location'
import * as api from 'utils/api'
import wif from 'wif'
import { subscribe } from 'actions/notification'
import { Platform } from 'react-native'
import { getRegisterationID, getDeviceID } from 'utils/nativeUtil'

function* createEOSAccountRequested(action: Action<CreateEOSAccountParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    // const hint = action.payload.hint
    const inviteCode = action.payload.inviteCode
    let privateKey = action.payload.privateKey

    if (privateKey) {
      assert(isValidPrivate(privateKey), 'Invalid private key!')
    } else {
      privateKey = yield call(randomKey)
    }

    const publicKey = yield call(privateToPublic, privateKey)

    const result = yield call(api.createEOSAccount, {
      inviteCode,
      chainType: 'eos',
      walletId: eosAccountName,
      ownerKey: publicKey,
      activeKey: publicKey
    })

    const txhash = result.txhash
    assert(txhash, 'No txhash!')

    const permission = 'OWNER'
    const privateKeyDecodedString = wif.decode(privateKey).privateKey.toString('hex')
    const keystore = yield call(encrypt, privateKeyDecodedString, password, { origin: 'classic', coin: 'EOS' })
    const walletInfo = {
      eosAccountName,
      permission,
      publicKey,
      coin: 'EOS',
      timestamp: +Date.now(),
      origin: 'classic'
    }
    const accountInfo = getInitialAccountInfo(eosAccountName, publicKey)
    const eosAccountCreationInfo = {
      eosAccountName,
      publicKey,
      transactionId: txhash,
      irreversible: false,
      backup: false,
      node: BITPORTAL_API_EOS_URL,
      timestamp: +Date.now()
    }

    yield all([
      call(secureStorage.setItem, `EOS_ACCOUNT_CREATION_INFO_${eosAccountName}`, eosAccountCreationInfo, true),
      call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, accountInfo, true),
      call(secureStorage.setItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_${permission}_${publicKey}`, keystore, true),
      call(secureStorage.setItem, `CLASSIC_WALLET_INFO_EOS_${eosAccountName}`, walletInfo, true),
      call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)
    ])

    yield all([
      put(actions.syncEOSAccountCreationInfo(eosAccountCreationInfo)),
      put(actions.createEOSAccountSucceeded(accountInfo)),
      put(createClassicWalletSucceeded(walletInfo)),
      put(actions.getEOSAccountRequested({ eosAccountName: walletInfo.eosAccountName })),
      put(reset('createEOSAccountForm'))
    ])

    if (action.payload.componentId) push('BitPortal.Backup', action.payload.componentId)
  } catch (e) {
    yield put(actions.createEOSAccountFailed(getErrorMessage(e)))
  }
}

function* createEOSAccountAssistanceRequested(action: Action<CreateEOSAccountAssistanceParams>) {
  if (!action.payload) return
  try {
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const path = action.payload.path
    const privateKey = yield call(randomKey)
    const publicKey = yield call(privateToPublic, privateKey)

    const privateKeyDecodedString = wif.decode(privateKey).privateKey.toString('hex')
    const keystore = yield call(encrypt, privateKeyDecodedString, password, { origin: 'classic', coin: 'EOS' })

    const eos = yield call(initEOS, { httpEndpoint: BITPORTAL_API_EOS_URL })
    try {
      const info = yield call(eos.getAccount, eosAccountName)
      assert(!info && !info.account_name, 'Account name already exists')
    } catch (e) {
      const message = typeof e === 'object' ? e.message : e
      if (message === 'Account name already exists') {
        yield put(actions.createEOSAccountFailed(getErrorMessage(e)))
      } else {
        const errMsg = typeof message === 'string' ? JSON.parse(message) : message
        if (errMsg && errMsg.message === 'Internal Service Error') {
          const eosAccountCreationRequestInfo = {
            eosAccountName,
            ownerPublicKey: publicKey,
            activePublicKey: publicKey,
            ownerKeystore: keystore,
            activeKeystore: keystore,
            timestamp: +Date.now(),
            path
          }
          yield all([
            call(secureStorage.setItem, `EOS_ACCOUNT_CREATION_REQUEST_INFO`, eosAccountCreationRequestInfo, true),
            put(actions.createEOSAccountAssistanceSucceeded(eosAccountCreationRequestInfo))
          ])
          if (action.payload.componentId) push(`BitPortal.${path}`, action.payload.componentId)
        } else {
          yield put(actions.createEOSAccountFailed(getErrorMessage(e)))
        }
      }
    }
  } catch (e) {
    yield put(actions.createEOSAccountFailed(getErrorMessage(e)))
  }
}

function* cancelEOSAccountAssistanceRequestd(action: any) {
  try {
    yield call(secureStorage.removeItem, `EOS_ACCOUNT_CREATION_REQUEST_INFO`)
    if (action.payload.componentId) popToRoot(action.payload.componentId)
  } catch (e) {}
}

function* showAssistanceAccountInfo(action: any) {
  try {
    const eosAccountCreationRequestInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_CREATION_REQUEST_INFO`, true)
    yield put(actions.createEOSAccountAssistanceSucceeded(eosAccountCreationRequestInfo))
    const path = eosAccountCreationRequestInfo.path
    if (action.payload.componentId) push(`BitPortal.${path}`, action.payload.componentId)
  } catch (e) {}
}

function* importEOSAccountRequested(action: Action<ImportEOSAccountParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const publicKey = action.payload.publicKey
    const privateKey = action.payload.privateKey
    const password = action.payload.password
    const accountInfo = action.payload.accountInfo
    const permission = action.payload.permission.toUpperCase()

    const privateKeyDecodedString = wif.decode(privateKey).privateKey.toString('hex')
    const keystore = yield call(encrypt, privateKeyDecodedString, password, { origin: 'classic', coin: 'EOS' })
    const walletInfo = {
      eosAccountName,
      permission,
      publicKey,
      coin: 'EOS',
      timestamp: +Date.now(),
      origin: 'classic'
    }

    yield all([
      call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, accountInfo, true),
      call(secureStorage.setItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_${permission}_${publicKey}`, keystore, true),
      call(secureStorage.setItem, `CLASSIC_WALLET_INFO_EOS_${eosAccountName}`, walletInfo, true),
      call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)
    ])

    yield all([
      put(actions.importEOSAccountSucceeded(accountInfo)),
      put(createClassicWalletSucceeded(walletInfo)),
      put(actions.getEOSAccountRequested({ eosAccountName: walletInfo.eosAccountName })),
      put(reset('importEOSAccountForm'))
    ])

    if (action.payload.componentId) popToRoot(action.payload.componentId)

    // trace import
    const params = {
      bpId: '',
      walletId: eosAccountName,
      chainType: 'eos',
      ownerKey: publicKey,
      activeKey: publicKey
    }
    // console.log('###--', params)
    yield put(traceImport(params))
  } catch (e) {
    yield put(actions.importEOSAccountFailed(getErrorMessage(e)))
  }
}

function* getEOSKeyAccountsRequested(action: Action<GetEOSKeyAccountsParams>) {
  if (!action.payload) return

  try {
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
    let keyPermissions: string[] = []

    for (const accountName of keyAccounts) {
      const accountInfo = yield call(eos.getAccount, accountName)
      const permissions = getPermissionsByKey(publicKey, accountInfo)
      keyPermissions = [...keyPermissions, ...permissions]
    }

    yield put(actions.getEOSKeyAccountsSucceeded(result))
    if (action.payload.componentId)
      push('BitPortal.AccountSelection', action.payload.componentId, {
        keyPermissions,
        publicKey,
        privateKey,
        password,
        hint
      })
  } catch (e) {
    yield put(actions.getEOSKeyAccountsFailed(getEOSErrorMessage(e)))
  }
}

function* getEOSAccountRequested(action: Action<GetEOSAccountParams>) {
  if (!action.payload) return
  
  try {
    const eosAccountName = action.payload.eosAccountName
    const eosAccountCreationInfo = yield select((state: RootState) => state.eosAccount.get('eosAccountCreationInfo'))

    const useCreationServer =
      eosAccountCreationInfo.get('transactionId') &&
      eosAccountCreationInfo.get('eosAccountName') === eosAccountName &&
      !eosAccountCreationInfo.get('irreversible')
    const eos = yield call(initEOS, useCreationServer ? { httpEndpoint: BITPORTAL_API_EOS_URL } : {})
    const info = yield call(eos.getAccount, eosAccountName)
    assert(info && info.account_name, 'Invalid account info')
    yield put(actions.getEOSAccountSucceeded(info))
    yield call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, info, true)

    // notification subscribe
    const language = yield select((state: RootState) => state.intl.get('locale'))
    const registerationID = yield call(getRegisterationID)
    const deviceId = yield call(getDeviceID)
    const code = 'eosio.token'
    const data = yield call(eos.getCurrencyBalance, { code, account: eosAccountName })
    const symbol = (data && data[0]) ? data[0].split(' ')[1] : 'eos'
    const params = {
      language,
      deviceId,
      deviceToken: registerationID,
      bpId: '',
      chainType: symbol,
      walletId: eosAccountName,
      topic: '',
      platform: `mobile_${Platform.OS}`
    }
    console.log('###--', params)
    yield put(subscribe(params))
  } catch (e) {
    yield put(actions.getEOSAccountFailed(e.message))
  }
}

function* getEOSAccountSucceeded(action: Action<GetEOSAccountResult>) {
  if (!action.payload) return

  const votedProducers = yield select((state: RootState) => votedProducersSelector(state))
  if (votedProducers) yield put(setSelected(votedProducers))

  const balanceInfo = yield select((state: RootState) => eosCoreLiquidBalanceSelector(state))
  const eosAccountName = action.payload.account_name
  const coreLiquidBalance = action.payload.core_liquid_balance

  const activeAsset = yield select((state: RootState) => state.balance.get('activeAsset'))
  // default active asset set to EOS
  if (!activeAsset) yield put(setActiveAsset(balanceInfo))

  if (eosAccountName && coreLiquidBalance && balanceInfo) {
    yield put(getEOSAssetBalanceSucceeded({ eosAccountName, balanceInfo: balanceInfo.toJS() }))
    yield put(getEOSBalanceSucceeded({ eosAccountName, balanceInfo: balanceInfo.toJS() }))
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

function* createEOSAccountForOthersRequested(action: Action<CreateEOSAccountForOthersParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const ownerPublicKey = action.payload.ownerPublicKey
    const activePublicKey = action.payload.activePublicKey
    const password = action.payload.password
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const creator = yield select((state: RootState) => eosAccountNameSelector(state))

    const result = yield call(createEOSAccount, {
      creator,
      eosAccountName,
      ownerPublicKey,
      activePublicKey,
      password,
      permission
    })
    yield put(actions.createEOSAccountForOthersSucceeded(result))
  } catch (e) {
    yield put(actions.createEOSAccountForOthersFailed(getEOSErrorMessage(e)))
  }
}

function* checkEOSAccountCreationStatusRequested(action: Action<CheckEOSAccountStatusParams>) {
  if (!action.payload) return

  try {
    const eosAccountCreationRequestInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_CREATION_REQUEST_INFO`, true)
    const {
      eosAccountName,
      ownerPublicKey,
      activePublicKey,
      ownerKeystore,
      activeKeystore
    } = eosAccountCreationRequestInfo

    const eos = yield call(initEOS, {})
    const accountInfo = yield call(eos.getAccount, eosAccountName)

    const validateOwnerKey = yield call(validateEOSPublicKeyByInfo, accountInfo, 'OWNER', ownerPublicKey)
    assert(validateOwnerKey, 'Owner public key dose not match!')
    const validateActiveKey = yield call(validateEOSPublicKeyByInfo, accountInfo, 'ACTIVE', activePublicKey)
    assert(validateActiveKey, 'Active public key dose not match!')

    const walletInfo = {
      eosAccountName,
      permission: 'OWNER',
      publicKey: ownerPublicKey,
      coin: 'EOS',
      timestamp: +Date.now(),
      origin: 'classic'
    }

    const eosAccountCreationInfo = {
      eosAccountName,
      publicKey: ownerPublicKey,
      transactionId: '',
      irreversible: false,
      backup: false,
      node: EOS_API_URL,
      timestamp: +Date.now()
    }

    yield all([
      call(secureStorage.setItem, `EOS_ACCOUNT_CREATION_INFO_${eosAccountName}`, eosAccountCreationInfo, true),
      put(actions.syncEOSAccountCreationInfo(eosAccountCreationInfo)),
      call(secureStorage.setItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, accountInfo, true),
      call(
        secureStorage.setItem,
        `CLASSIC_KEYSTORE_EOS_${eosAccountName}_OWNER_${ownerPublicKey}`,
        ownerKeystore,
        true
      ),
      call(
        secureStorage.setItem,
        `CLASSIC_KEYSTORE_EOS_${eosAccountName}_ACTIVE_${activePublicKey}`,
        activeKeystore,
        true
      ),
      call(secureStorage.setItem, `CLASSIC_WALLET_INFO_EOS_${eosAccountName}`, walletInfo, true),
      call(secureStorage.setItem, 'ACTIVE_WALLET', walletInfo, true)
    ])

    yield all([
      put(actions.importEOSAccountSucceeded(accountInfo)),
      put(createClassicWalletSucceeded(walletInfo)),
      put(actions.getEOSAccountRequested({ eosAccountName: walletInfo.eosAccountName }))
    ])

    yield put(actions.checkEOSAccountCreationStatusSucceeded(accountInfo))
    if (action.payload.componentId) popToRoot(action.payload.componentId)
  } catch (e) {
    yield put(actions.checkEOSAccountCreationStatusFailed(getEOSErrorMessage(e)))
  }
}

export default function* eosAccountSaga() {
  yield takeEvery(String(actions.createEOSAccountRequested), createEOSAccountRequested)
  yield takeEvery(String(actions.importEOSAccountRequested), importEOSAccountRequested)
  yield takeEvery(String(actions.getEOSAccountRequested), getEOSAccountRequested)
  yield takeEvery(String(actions.getEOSAccountSucceeded), getEOSAccountSucceeded)
  yield takeEvery(String(actions.validateEOSAccountRequested), validateEOSAccountRequested)
  yield takeEvery(String(actions.validateEOSAccountSucceeded), validateEOSAccountSucceeded)
  yield takeEvery(String(actions.validateEOSAccountFailed), validateEOSAccountFailed)
  yield takeEvery(String(actions.getEOSKeyAccountsRequested), getEOSKeyAccountsRequested)
  yield takeEvery(String(actions.createEOSAccountAssistanceRequested), createEOSAccountAssistanceRequested)
  yield takeEvery(String(actions.cancelEOSAccountAssistanceRequestd), cancelEOSAccountAssistanceRequestd)
  yield takeEvery(String(actions.showAssistanceAccountInfo), showAssistanceAccountInfo)
  yield takeEvery(String(actions.createEOSAccountForOthersRequested), createEOSAccountForOthersRequested)
  yield takeEvery(String(actions.checkEOSAccountCreationStatusRequested), checkEOSAccountCreationStatusRequested)
}
