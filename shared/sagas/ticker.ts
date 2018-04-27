import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/ticker'

function* getTickers(action: Action<TickerParams>) {
  if (!action.payload) return
  try {
    const data = yield call(api.getTickers, action.payload)
    yield put(actions.getTickersSucceeded(data))
  } catch (e) {
    yield put(actions.getTickersFailed(e.message))
  }
}

export default function* tickerSaga() {
  yield takeEvery(String(actions.getTickersRequested), getTickers)
}
