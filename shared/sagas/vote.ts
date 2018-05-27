import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/vote'
import { getEOS } from 'eos'

function* getVoteData(action: Action<VoteParams>) {
  if (!action.payload) return

  try {
    const eos = getEOS()
    const data = yield call(eos.getVoteListData, action.payload)
    yield put(actions.getVoteDataSucceeded(data))
  } catch (e) {
    yield put(actions.getVoteDataFailed(e.message))
  }
}


export default function* tickerSaga() {
  yield takeEvery(String(actions.getVoteDataRequested), getVoteData)
}
