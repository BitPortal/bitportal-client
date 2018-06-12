import { call, put, takeEvery } from 'redux-saga/effects'
import * as actions from 'actions/currency'
import * as api from 'utils/api'

function* getCurrencyRate() {
  try {
    let data = yield call(api.getCurrencyRate)
    console.log('####', data)
    const params = { 
      symbol: data.success ? data.source : 'CNY',
      rate: data.success ? data.quotes['USDCNY'] : 1
    }
    yield put(actions.getCurrencyRateSucceeded(params))
  } catch (e) {
    console.log('####', e.message)
    yield put(actions.getCurrencyRateFailed(e.message))
  }
}

export default function* currencyRateSaga() {
  yield takeEvery(String(actions.getCurrencyRateRequested), getCurrencyRate)
}
    