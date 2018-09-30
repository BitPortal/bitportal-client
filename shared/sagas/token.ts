import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/token'

function* getTokenDetail(action: Action<TokenParams>) {
  console.log('in TokenDetail saga')
  if (!action.payload) return

  try {
    const data = yield call(api.getTokenDetail, action.payload)
    yield put(actions.getTokenDetailSucceeded(data))
  } catch (e) {
    yield put(actions.getTokenDetailFailed(e.message))
  }
}

export default function* tokenSaga() {
  yield takeEvery(String(actions.getTokenDetailRequested), getTokenDetail)
}
