import { call, put, takeEvery, select } from 'redux-saga/effects'
import * as actions from 'actions/version'
import { Action } from 'redux-actions'
import storage from 'utils/storage'
import * as api from 'utils/api'
import { update } from 'utils/update'

function* getVersionInfo() {
  try {
    const data = yield call(api.getVersionInfo)
    const locale = yield select((state: any) => state.intl.get('locale'))
    const lastVersion = data[0].lastVersion
    update(data[0], locale)
    yield put(actions.getVersionInfoSucceeded(data[0]))
    yield call(storage.setItem, 'bitportal_version', action.payload)
  } catch (e) {
    yield put(actions.getVersionInfoFailed(e.message))
  }
}

function* setVersionInfo(action: Action<string>) {
  if (!action.payload) return
  yield call(storage.setItem, 'bitportal_version', action.payload)
}

export default function* versionSaga() {
  yield takeEvery(String(actions.getVersionInfoRequested), getVersionInfo)
  yield takeEvery(String(actions.setVersionInfo), setVersionInfo)
}
