import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/vote'
import { initAccount } from 'eos'

function* getVoteData(action: Action<VoteParams>) {
  if (!action.payload) return
  console.log("### --fetch producer", action.payload)
  try {
    const { eos } = yield call(initAccount, {})
    console.log("###--fetch producer", eos, action.payload)
    eos.getProducers(action.payload).then((result: any) => { 
      console.log('####', result)
    })
    // const data = yield call(eos.getProducers, action.payload)
    // yield put(actions.getVoteDataSucceeded(data))
  } catch (e) {
    yield put(actions.getVoteDataFailed(e.message))
  }
}


export default function* tickerSaga() {
  yield takeEvery(String(actions.getVoteDataRequested), getVoteData)
}
