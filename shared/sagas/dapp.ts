import { takeEvery, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import * as actions from 'actions/dapp'
import * as api from 'utils/api'

function* getDapp(action: Action) {
  try {
    const result = yield call(api.getDapp, { ...action.payload, _sort: 'display_priority:desc', status: 'published' })
    yield put(actions.updateDapp(result))
    yield put(actions.getDapp.succeeded())
  } catch (e) {
    yield put(actions.getDapp.failed(getErrorMessage(e)))
  }
}

function* getDappRecommend(action: Action) {
  try {
    // Todo:: get locale
    let lang = 'zh'
    let result = yield call(api.getDappBanner, { _sort: 'display_priority:desc', status: 'published', language: lang })
    // fallback to en
    if (result.length === 0) {
      result = yield call(api.getDappBanner, { _sort: 'display_priority:desc', status: 'published', language: 'en' })
    }
    yield put(actions.updateDappRecommend(result))
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
