import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/stake'
import { decrypt } from 'key'
import { initEOS } from 'eos'
import secureStorage from 'utils/secureStorage'
import wif from 'wif'

function* stakeRequested(action: Action<object>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const eosAccountName = action.payload.eosAccountName
    const amount = action.payload.amount
    const password = action.payload.password

    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    assert(accountInfo.permissions && accountInfo.permissions.length, 'EOS account permissions dose not exist!')
    const permissions = accountInfo.permissions
    const activePermission = permissions.filter(item => item.perm_name === 'active')
    assert(activePermission.length && activePermission[0].required_auth && activePermission[0].required_auth.keys && activePermission[0].required_auth.keys.length, 'Active permission dose not exist!')

    let activeWifs = []
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

    eos = initEOS({
      keyProvider: activeWifs,
      broadcast: true,
      sign: true
    })

    const myaccount = yield call(eos.contract, 'eosio')
    console.log(myaccount.stakevote)
    // yield call(myaccount.stakevote, { name: eosAccountName, amount: `${amount} EOS` })
    yield put(actions.stakeSucceeded())
  } catch (e) {
    yield put(actions.stakeFailed(e.message))
  }
}

function* unstakeRequested(action: Action<object>) {
  if (!action.payload) return

  try {
    const password = action.payload.password
    console.log(password)
    // yield put(actions.unstakeSucceeded())
  } catch (e) {
    yield put(actions.unstakeFailed(e.message))
  }
}

export default function* stakeSaga() {
  yield takeEvery(String(actions.stakeRequested), stakeRequested)
  yield takeEvery(String(actions.unstakeRequested), unstakeRequested)
}
