import { delay } from 'redux-saga'
import { all, call, put, takeEvery, takeLatest, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/eosAsset'
import { toggledEOSAssetSelector } from 'selectors/eosAsset'
import storage from 'utils/storage'

function* getEOSAssetRequested(action: Action<GetEOSAssetParams>) {
  try {
    const data = yield call(api.getEOSAsset, { ...action.payload, _sort: 'display_priority:desc', display_priority_gte: 1 })
    yield put(actions.getEOSAssetSucceeded(data))
  } catch (e) {
    yield put(actions.getEOSAssetFailed(e.message))
  }
}

function* searchEOSAssetRequested(action: Action<string>) {
  try {
    if (!action.payload) {
      yield put(actions.clearSearch())
    } else {
      const [data] = yield all([
        call(api.getEOSAsset, { symbol_contains: action.payload, _sort: 'display_priority:desc' }),
        delay(1000)
      ])

      yield put(actions.searchEOSAssetSucceeded(data))
    }
  } catch (e) {
    yield put(actions.searchEOSAssetFailed(e.message))
  }
}

function* toggleEOSAsset() {
  const toggledEOSAsset = yield select((state: RootState) => toggledEOSAssetSelector(state))
  yield call(storage.setItem, 'bitportal_toggledEOSAsset', toggledEOSAsset.toJS(), true)
}

export default function* eosAssetSaga() {
  yield takeEvery(String(actions.getEOSAssetRequested), getEOSAssetRequested)
  yield takeEvery(String(actions.toggleEOSAsset), toggleEOSAsset)
  yield takeLatest(String(actions.searchEOSAssetRequested), searchEOSAssetRequested)
}
