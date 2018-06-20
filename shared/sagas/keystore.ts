import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import assert from 'assert'
import * as actions from 'actions/keystore'
import { getErrorMessage, encodeKey } from 'utils'
import secureStorage from 'utils/secureStorage'
import { Navigation } from 'react-native-navigation'
import { decrypt, getEOSKeys } from 'key'
import { isValidPrivate, privateToPublic } from 'eos'
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

function* exportEOSKeyRequested(action: Action<ExportEOSKeyParams>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const password = action.payload.password
    assert(password, 'Please input password!')
    const origin = action.payload.origin
    assert(origin, 'Missing origin!')

    let ownerWifs = []
    let activeWifs = []
    if (origin === 'hd') {
      const bpid = action.payload.bpid
      const keystore = yield call(secureStorage.getItem, `HD_KEYSTORE_${bpid}`, true)
      assert(keystore, 'Missing keystore!')
      const entropy = yield call(decrypt, keystore, password)
      assert(entropy, 'Missing entropy!')
      const eosKeys = yield call(getEOSKeys, entropy, true)
      ownerWifs = [eosKeys.keys.owner.privateKey.wif]
      activeWifs = [eosKeys.keys.active.privateKey.wif]
    } else {
      const eosAccountName = action.payload.eosAccountName
      const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)

      assert(accountInfo.permissions && accountInfo.permissions.length, 'EOS account permissions dose not exist!')
      const permissions = accountInfo.permissions
      const ownerPermission = permissions.filter((item: any) => item.perm_name === 'owner')
      assert(ownerPermission.length && ownerPermission[0].required_auth && ownerPermission[0].required_auth.keys && ownerPermission[0].required_auth.keys.length, 'Owner permission dose not exist!')
      const activePermission = permissions.filter((item: any) => item.perm_name === 'active')
      assert(activePermission.length && activePermission[0].required_auth && activePermission[0].required_auth.keys && activePermission[0].required_auth.keys.length, 'Active permission dose not exist!')

      const ownerPublicKeys = ownerPermission[0].required_auth.keys
      for (const publicKey of ownerPublicKeys) {
        const key = publicKey.key
        const keystore = yield call(secureStorage.getItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_OWNER_${key}`, true)
        if (keystore) {
          const privateKey = yield call(decrypt, keystore, password)
          const ownerWif = wif.encode(0x80, Buffer.from(privateKey, 'hex'), false)
          ownerWifs.push(ownerWif)
        }
      }

      const activePublicKeys = activePermission[0].required_auth.keys
      for (const publicKey of activePublicKeys) {
        const key = publicKey.key
        const keystore = yield call(secureStorage.getItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_ACTIVE_${key}`, true)
        if (keystore) {
          const privateKey = yield call(decrypt, keystore, password)
          const activeWif = wif.encode(0x80, Buffer.from(privateKey, 'hex'), false)
          activeWifs.push(activeWif)
        }
      }
    }

    assert(ownerWifs.length + activeWifs.length, 'No EOS private keys!')

    yield put(actions.exportEOSKeySucceeded())
    Navigation.handleDeepLink({
      link: '*',
      payload: {
        method: 'push',
        params: {
          screen: 'BitPortal.ExportPrivateKey',
          passProps: { ownerWifs, activeWifs }
        }
      }
    })
  } catch (e) {
    console.log(e)
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
  yield takeEvery(String(actions.syncKeyRequested), syncKeyRequested)
}
