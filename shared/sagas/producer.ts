import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/producer'
import * as api from 'utils/api'
import { initEOS } from 'core/eos'

function* getProducersRequested(action: Action<GetProducersParams>) {
  if (!action.payload) return

  try {
    const eos = yield call(initEOS, {})
    const producers = yield call(eos.getProducers, action.payload)
    yield put(actions.getProducersSucceeded(producers))
    yield put(actions.getProducersInfoRequested({ _limit: 500 }))
  } catch (e) {
    yield put(actions.getProducersFailed(e.message))
  }
}

function* getProducersInfoRequested(action: Action<GetProducersInfoParams>) {
  try {
    const producers = yield call(api.getProducersInfo, action.payload)
    const info = producers.reduce((info: any, producer: any) => ({ ...info, [producer.account_name]: producer }), {})
    yield put(actions.getProducersInfoSucceeded(info))
  } catch (e) {
    yield put(actions.getProducersInfoFailed(e.message))
  }
}

export default function* producerSaga() {
  yield takeEvery(String(actions.getProducersRequested), getProducersRequested)
  yield takeEvery(String(actions.getProducersInfoRequested), getProducersInfoRequested)
}
