// import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/ram'
import { getEOSWifsByInfo } from 'key'
import secureStorage from 'utils/secureStorage'

function* buyRAMRequested(action: Action<BuyRAMParams>) {
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
    yield put(actions.buyRAMSucceeded({}))
  } catch (e) {
    yield put(actions.buyRAMFailed(e.message))
  }
}

function* sellRAMRequested(action: Action<SellRAMParams>) {
  if (!action.payload) return

  try {
    // const password = action.payload.password
    yield put(actions.sellRAMSucceeded({}))
  } catch (e) {
    yield put(actions.sellRAMFailed(e.message))
  }
}

export default function* ramSaga() {
  yield takeEvery(String(actions.buyRAMRequested), buyRAMRequested)
  yield takeEvery(String(actions.sellRAMRequested), sellRAMRequested)
}
