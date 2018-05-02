import { call, put, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/chart'

function* getChart(action: Action<ChartParams>) {
  if (!action.payload) return

  try {
    const data = yield call(api.getChart, action.payload)
    yield put(actions.getChartSucceeded(data))
  } catch (e) {
    yield put(actions.getChartFailed(e.message))
  }
}

export default function* chartSaga() {
  yield takeEvery(String(actions.getChartRequested), getChart)
}
