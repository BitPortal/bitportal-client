import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/transfer'

function* transfer(action: Action<ChartParams>) {
  if (!action.payload) return

  try {
    const data = yield call(api.transfer, action.payload)
    yield put(actions.transferSucceeded(data))
  } catch (e) {
    yield put(actions.transferFailed(e.message))
  }
}

export default function* transferSaga() {
  yield takeEvery(String(actions.transferRequested), transfer)
}
