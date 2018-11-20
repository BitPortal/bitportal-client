import { call, put, takeEvery, select } from 'redux-saga/effects'
import * as actions from 'actions/whiteList'
import { Action } from 'redux-actions'
import storage from 'utils/storage'

function* getVersionInfo() {
  try {
    const locale = yield select((state: any) => state.intl.get('locale'))
    
    yield call(storage.setItem, 'bitportal_version')
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
