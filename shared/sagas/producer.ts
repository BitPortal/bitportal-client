import assert from 'assert'
import { all, call, put, takeEvery, takeLatest, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { Action } from 'redux-actions'
import * as actions from 'actions/producer'
import * as api from 'utils/api'
import { getProducers } from 'core/chain/eos'
import { managingAccountVotedProducersSelector } from 'selectors/account'

function* getProducer(action: Action<GetProducerParams>) {
  try {
    const limit = action.payload.limit || 500
    let producersWithInfo
    let producersInfoObject: object

    const [producers, producersInfo] = yield all([
      call(getProducers, action.payload),
      call(api.getProducersInfo, { _limit: limit })
    ])

    assert(producers && producers.rows && producers.rows.length, 'No producers!')

    if (producersInfo) producersInfoObject = producersInfo.reduce((info: any, producer: any) => ({ ...info, [producer.account_name]: producer }), {})

    if (producers && producers.rows.length) {
      producersWithInfo = producers.rows.map((producer: any, index: number) => {
        const owner = producer.owner
        const info = producersInfoObject[owner]
        return info ? { info, ...producer, rank: index } : { ...producer, rank: index }
      })
    } else {
      producersWithInfo = producers
    }

    yield put(actions.updateProducer({
      producers: producersWithInfo,
      more: producers.more,
      total_producer_vote_weight: producers.total_producer_vote_weight
    }))

    yield put(actions.getProducer.succeeded())

    const votedProducers = yield select((state: any) => managingAccountVotedProducersSelector(state))
    yield put(actions.setSelected(votedProducers))
  } catch (e) {
    yield put(actions.getProducer.failed(e.message))
  }
}

function* handleProducerSearchTextChange(action: Action) {
  yield delay(500)
  const text = action.payload || ''
  yield put(actions.setProducerSearchText(text))
}

export default function* producerSaga() {
  yield takeEvery(String(actions.getProducer.requested), getProducer)
  yield takeEvery(String(actions.getProducer.refresh), getProducer)
  yield takeLatest(String(actions.handleProducerSearchTextChange), handleProducerSearchTextChange)
}
