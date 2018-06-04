import { call, put, takeEvery } from 'redux-saga/effects'
import * as actions from 'actions/versionInfo'
import *as api from 'utils/api'

function* getVersionInfo(action: any) {
  console.log('#####', action)
  try {
    const data = yield call(api.getVersionInfo)
    console.log('#####', data)
    yield put(actions.getVersionInfoSucceeded(data[0]))
  } catch (e) {
    yield put(actions.getVersionInfoFailed(e.message))
  }
}


export default function* versionInfoSaga() {
  yield takeEvery(String(actions.getVersionInfoRequested), getVersionInfo)
}
