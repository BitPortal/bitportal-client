import assert from 'assert'
import { takeEvery, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import * as actions from 'actions/dapp'
import * as api from 'utils/api'

function* getDapp(action: Action) {
  try {
    const result = yield call(api.getDapp)
    yield put(actions.updateDapp(result))
    yield put(actions.getDapp.succeeded())
  } catch (e) {
    yield put(actions.getDapp.failed(getErrorMessage(e)))
  }
}

function* getDappRecommend(action: Action) {
  try {
    const result = yield call(api.getDappBanner)
    yield put(actions.updateDappRecommend(result.sort((a: any, b: any) => +b.display_priority - +a.display_priority)))
    yield put(actions.getDappRecommend.succeeded())
  } catch (e) {
    yield put(actions.getDappRecommend.failed(getErrorMessage(e)))
  }
}

export default function* dappSaga() {
  yield takeEvery(String(actions.getDapp.requested), getDapp)
  yield takeEvery(String(actions.getDapp.refresh), getDapp)
  yield takeEvery(String(actions.getDappRecommend.requested), getDappRecommend)
  yield takeEvery(String(actions.getDappRecommend.refresh), getDappRecommend)
}
