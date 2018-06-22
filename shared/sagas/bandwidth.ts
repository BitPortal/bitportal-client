// import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/bandwidth'
import { getEOSWifsByInfo } from 'key'
import secureStorage from 'utils/secureStorage'

function* delegateBandwidthRequested(action: Action<DelegateBandwidthParams>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, ['active'])
    console.log(wifs)

    // const eos = initEOS({
    //   keyProvider: activeWifs,
    //   broadcast: true,
    //   sign: true
    // })

    // const myaccount = yield call(eos.contract, 'eosio')
    // console.log(myaccount.stakevote)
    // yield call(myaccount.stakevote, { name: eosAccountName, amount: `${amount} EOS` })
    yield put(actions.delegateBandwidthSucceeded({}))
  } catch (e) {
    yield put(actions.delegateBandwidthFailed(e.message))
  }
}

function* undelegateBandwidthRequested(action: Action<UndelegateBandwidthResult>) {
  if (!action.payload) return

  try {
    // const password = action.payload.password
    yield put(actions.undelegateBandwidthSucceeded({}))
  } catch (e) {
    yield put(actions.undelegateBandwidthFailed(e.message))
  }
}

export default function* bandwidthSaga() {
  yield takeEvery(String(actions.delegateBandwidthRequested), delegateBandwidthRequested)
  yield takeEvery(String(actions.undelegateBandwidthRequested), undelegateBandwidthRequested)
}
