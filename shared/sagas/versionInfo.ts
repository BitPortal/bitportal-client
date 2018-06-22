import { call, put, takeEvery, select } from 'redux-saga/effects'
import * as actions from 'actions/versionInfo'
import * as api from 'utils/api'
import { update } from 'utils/update'

function* getVersionInfo() {
  try {
    let data = yield call(api.getVersionInfo)
    const locale = yield select((state: any) => state.intl.get('locale'))
    update(data[0], locale)
    yield put(actions.getVersionInfoSucceeded(data[0]))
  } catch (e) {
    yield put(actions.getVersionInfoFailed(e.message))
  }
}

export default function* versionInfoSaga() {
  yield takeEvery(String(actions.getVersionInfoRequested), getVersionInfo)
}
