import { put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
// import * as api from 'utils/api'
import * as actions from 'actions/transferHistory'

function* getTransferHistory(action: Action<ChartParams>) {
  if (!action.payload) return

  try {
    // const data = yield call(api.getTransferHistory, action.payload)
    // yield put(actions.getTransferHistorySucceeded(data))
  } catch (e) {
    yield put(actions.getTransferHistoryFailed(e.message))
  }
}

export default function* transferHistorySaga() {
  yield takeEvery(String(actions.getTransferHistoryRequested), getTransferHistory)
}
