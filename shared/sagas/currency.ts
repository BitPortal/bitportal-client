import assert from 'assert'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as actions from 'actions/currency'
import * as api from 'utils/api'
import storage from 'utils/storage'
import { Action } from 'redux-actions'

function* getCurrencyRates(action: Action<GetCurrencyParams>) {
  try {
    const data = yield call(api.getCurrencyRates)
    const rates = Object.keys(data.rates).map(item => ({ symbol: item, rate: data.rates[item] }))

    yield put(actions.updateCurrencyRates(rates))
    yield put(actions.getCurrencyRates.succeeded())
  } catch (e) {
    yield put(actions.getCurrencyRates.failed(e.message))
  }
}

function* setCurrency(action: Action<string>) {
  if (!action.payload) return

  const symbol = action.payload
  // yield put(actions.getCurrencyRateRequested({ symbol }))
}

export default function* currencySaga() {
  yield takeEvery(String(actions.setCurrency), setCurrency)
  yield takeEvery(String(actions.getCurrencyRates.requested), getCurrencyRates)
}
