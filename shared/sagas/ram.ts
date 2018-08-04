import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/ram'
import { getEOSAccountRequested } from 'actions/eosAccount'
import { initEOS } from 'core/eos'
import { getEOSWifsByInfo } from 'core/key'
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
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, [permission])
    const keyProvider = wifs.map((item: any) => item.wif)
    const eos = yield call(initEOS, { keyProvider })

    yield call(
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
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, [permission])
    const keyProvider = wifs.map((item: any) => item.wif)
    const eos = yield call(initEOS, { keyProvider })

    yield call(
      eos.transaction,
      (tr: any) => tr.sellram({ bytes, account: eosAccountName })
    )

    yield put(actions.sellRAMSucceeded({}))
    yield put(reset('tradeRAMForm'))
    yield put(getEOSAccountRequested({ eosAccountName }))
    yield delay(2000)
    yield put(getEOSAccountRequested({ eosAccountName }))
  } catch (e) {
    yield put(actions.sellRAMFailed(getErrorMessage(e)))
  }
}

function* getRAMMarketRequested() {
  try {
    const eos = yield call(initEOS, {})
    const data = yield call(eos.getTableRows, {
      json: true,
      code: 'eosio',
      scope: 'eosio',
      table: 'rammarket',
      table_key: 'rammarket'
    })

    yield put(actions.getRAMMarketSucceeded(data))
  } catch (e) {
    yield put(actions.getRAMMarketFailed(getErrorMessage(e)))
  }
}

export default function* ramSaga() {
  yield takeEvery(String(actions.buyRAMRequested), buyRAMRequested)
  yield takeEvery(String(actions.sellRAMRequested), sellRAMRequested)
  yield takeEvery(String(actions.getRAMMarketRequested), getRAMMarketRequested)
}
