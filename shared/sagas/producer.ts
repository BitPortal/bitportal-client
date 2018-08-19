import assert from 'assert'
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/producer'
import * as api from 'utils/api'
import { initEOS } from 'core/eos'

function* getProducersWithInfoRequested(action: Action<GetProducersWithInfoParams>) {
  if (!action.payload) return

  try {
    const limit = action.payload.limit || 500
    let producersWithInfo
    let producersInfoObject: object

    const eos = yield call(initEOS, {})
    const [producers, producersInfo] = yield all([
      call(eos.getProducers, action.payload),
      call(api.getProducersInfo, { _limit: limit })
    ])

    assert(producers && producers.rows && producers.rows.length, 'No producers!')

    if (producersInfo) producersInfoObject = producersInfo.reduce((info: any, producer: any) => ({ ...info, [producer.account_name]: producer }), {})

    if (producers && producers.rows.length) {
      producersWithInfo = producers.rows.map((producer: any, index: number) => {
        const owner = producer.owner
        const info = producersInfoObject[owner]
        return info ? { ...producer, rank: index, info } : { ...producer, rank: index }
      })
    } else {
      producersWithInfo = producers
    }

    const total_producer_vote_weight = producers.total_producer_vote_weight
    const more = producers.more
    yield put(actions.getProducersWithInfoSucceeded({ total_producer_vote_weight, more, rows: producersWithInfo }))
  } catch (e) {
    yield put(actions.getProducersWithInfoFailed(e.message))
  }
}

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
  yield takeEvery(String(actions.getProducersWithInfoRequested), getProducersWithInfoRequested)
}
