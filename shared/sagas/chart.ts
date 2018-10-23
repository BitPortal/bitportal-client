import { call, put, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/chart'

function* getChart(action: Action<ChartParams>) {
  if (!action.payload) return

  try {
    const data = yield call(api.getChart, action.payload)
    yield put(actions.getChartSucceeded({ data, chartType: action.payload.chartType }))
  } catch (e) {
    yield put(actions.getChartFailed(e.message))
  }
}

function* changeChartRange(action: Action<string>) {
  const chartType = yield select((state: RootState) => state.chart.get('chartType'))
  const symbol = yield select((state: RootState) => {
    console.log('changeChartRange', state.ticker.toJS())
    return state.ticker.get('currentSymbol')
  })

  yield put(actions.getChartRequested({ symbol, chartType }))
}

export default function* chartSaga() {
  yield takeEvery(String(actions.getChartRequested), getChart)
  yield takeEvery(String(actions.changeChartRange), changeChartRange)
}
