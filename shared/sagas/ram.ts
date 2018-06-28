import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/ram'
import { getEOSAccountRequested } from 'actions/eosAccount'
import { initEOS } from 'eos'
import { getEOSWifsByInfo } from 'key'
import secureStorage from 'utils/secureStorage'
import { reset } from 'redux-form/immutable'
import { getErrorMessage } from 'utils'

function* buyRAMRequested(action: Action<BuyRAMParams>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const quant = action.payload.quant
    assert(quant, 'Invalid quant!')
    const asset = (+quant).toFixed(4)
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, ['active'])
    const activeWifs = wifs.activeWifs

    const eos = initEOS({
      keyProvider: activeWifs
    })

    const result = yield call(
      eos.transaction,
      (tr: any) => tr.buyram({ payer: eosAccountName, receiver: eosAccountName, quant: `${asset} EOS` })
    )

    yield put(actions.buyRAMSucceeded({}))
    yield put(reset('tradeRAMForm'))
    yield put(getEOSAccountRequested({ eosAccountName }))
  } catch (e) {
    yield put(actions.buyRAMFailed(getErrorMessage(e)))
  }
}

function* sellRAMRequested(action: Action<SellRAMParams>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const bytes = action.payload.bytes
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, ['active'])
    const activeWifs = wifs.activeWifs

    const eos = initEOS({
      keyProvider: activeWifs
    })

    const result = yield call(
      eos.transaction,
      (tr: any) => tr.sellram({ bytes, account: eosAccountName })
    )

    yield put(actions.sellRAMSucceeded({}))
    yield put(reset('tradeRAMForm'))
    yield put(getEOSAccountRequested({ eosAccountName }))
  } catch (e) {
    yield put(actions.sellRAMFailed(getErrorMessage(e)))
  }
}

export default function* ramSaga() {
  yield takeEvery(String(actions.buyRAMRequested), buyRAMRequested)
  yield takeEvery(String(actions.sellRAMRequested), sellRAMRequested)
}
