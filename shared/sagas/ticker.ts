import assert from 'assert'
import { takeEvery, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import { getEOSRAMMarket } from 'core/chain/eos'
import * as actions from 'actions/ticker'
import * as api from 'utils/api'

function* getTicker(action: Action) {
  try {
    const result = yield call(api.getTicker)
    yield put(actions.updateTicker(result))
    yield put(actions.getTicker.succeeded())
  } catch (e) {
    yield put(actions.getTicker.failed(getErrorMessage(e)))
  }
}

function* getEOSRAMTicker(action: Action) {
  try {
    const data = yield call(getEOSRAMMarket)
    const info = data.rows[0]
    const id = 'EOS/RAM'
    const unit = 'EOS/KB'
    let price = null

    if (info && info.base.balance && info.quote.balance) {
      const baseBalance = info.base.balance.split(' ')[0]
      const quoteBalance = info.quote.balance.split(' ')[0]
      price = (+quoteBalance / +baseBalance) * 1000
    }

    yield put(actions.updateEOSRAMTicker({ id, price, unit }))
    yield put(actions.getEOSRAMTicker.succeeded())
  } catch (e) {
    yield put(actions.getEOSRAMTicker.failed(getErrorMessage(e)))
  }
}

export default function* tickerSaga() {
  yield takeEvery(String(actions.getTicker.requested), getTicker)
  yield takeEvery(String(actions.getTicker.refresh), getTicker)
  yield takeEvery(String(actions.getEOSRAMTicker.requested), getEOSRAMTicker)
  yield takeEvery(String(actions.getEOSRAMTicker.refresh), getEOSRAMTicker)
}
