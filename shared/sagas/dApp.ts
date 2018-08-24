import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/dApp'

function* getDappList(action: Action<TokenParams>) {
  // if (!action.payload) return

  try {
    const data = yield call(api.getDappList, action.payload)
    yield put(actions.getDappListSucceeded(data))
  } catch (e) {
    yield put(actions.getDappListFailed(e.message))
  }
}

export default function* dAppSaga() {
  yield takeEvery(String(actions.getDappListRequested), getDappList)
}
