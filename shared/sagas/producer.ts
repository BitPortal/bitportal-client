import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/producer'
import { initAccount } from 'eos'

function* getProducersRequested(action: Action<GetProducersParams>) {
  if (!action.payload) return

  try {
    const { eos } = yield call(initAccount, {})
    const producers = yield call(eos.getProducers, action.payload)
    yield put(actions.getProducersSucceeded(producers))
  } catch (e) {
    yield put(actions.getProducersFailed(e.message))
  }
}

export default function* producerSaga() {
  yield takeEvery(String(actions.getProducersRequested), getProducersRequested)
}
