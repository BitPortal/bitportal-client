import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/ticker'
import * as marketActions from 'actions/market'

function* getTickers(action: Action<TickerParams>) {
  if (!action.payload) return
  try {
    const data = yield call(api.getTickers, action.payload)
    // console.log('###', action.payload, data[0]['quote_asset'])
    if (data && data.length > 0 && data[0] && data[0]['quote_asset'] === action.payload.quote_asset) {
      yield put(marketActions.endToRefreshTicker())
    }
    yield put(actions.getTickersSucceeded(data))
  } catch (e) {
    yield put(actions.getTickersFailed(e.message))
    yield put(marketActions.endToRefreshTicker())
  }
}

export default function* tickerSaga() {
  yield takeEvery(String(actions.getTickersRequested), getTickers)
}
