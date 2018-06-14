import assert from 'assert'
import { call, put, takeEvery } from 'redux-saga/effects'
import * as actions from 'actions/currency'
import * as api from 'utils/api'
import storage from 'utils/storage'
import { DEFAULT_USD_RATE } from 'constants/market'

function* getCurrencyRate(action: any) {
  try {
    const symbol = action.payload.symbol
    let currency = { symbol: 'USD', rate: 1 }

    if (symbol !== 'USD') {
      const data = yield call(api.getCurrencyRate)
      assert(data.success, 'Get rate failed!')

      currency = {
        symbol: action.payload.symbol,
        rate: data.quotes['USDCNY']
      }
    }

    yield put(actions.getCurrencyRateSucceeded(currency))
  } catch (e) {
    yield put(actions.getCurrencyRateFailed(e.message))
    yield put(actions.setRate(DEFAULT_USD_RATE[action.payload.symbol]))
  }
}

function* setCurrency(action: Action<string>) {
  const symbol = action.payload
  yield put(actions.getCurrencyRateRequested({ symbol }))
}

function* getCurrencyRateSucceeded(action: Action<string>) {
  try {
    const currency = action.payload
    yield call(storage.setItem, 'bitportal_currency', currency, true)
  } catch (e) {
    console.log(e)
  }
}

export default function* currencyRateSaga() {
  yield takeEvery(String(actions.getCurrencyRateRequested), getCurrencyRate)
  yield takeEvery(String(actions.getCurrencyRateSucceeded), getCurrencyRateSucceeded)
  yield takeEvery(String(actions.setCurrency), setCurrency)
}
