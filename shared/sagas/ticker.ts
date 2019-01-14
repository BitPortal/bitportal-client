import assert from 'assert'
import { takeEvery, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
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

export default function* tickerSaga() {
  yield takeEvery(String(actions.getTicker.requested), getTicker)
  yield takeEvery(String(actions.getTicker.refresh), getTicker)
}
