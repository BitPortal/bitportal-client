import { call, put, takeEvery } from 'redux-saga/effects'
import * as actions from 'actions/currency'
import * as api from 'utils/api'

function* getCurrencyRate(action: any) {
  try {
    let data = yield call(api.getCurrencyRate)
    const params = { 
      symbol: action.payload.symbol,
      rate: data.success ? data.quotes['USDCNY'] : 1
    }
    yield put(actions.getCurrencyRateSucceeded(params))
  } catch (e) {
    yield put(actions.getCurrencyRateFailed(e.message))
  }
}

export default function* currencyRateSaga() {
  yield takeEvery(String(actions.getCurrencyRateRequested), getCurrencyRate)
}
    