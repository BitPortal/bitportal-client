import { call, put, takeEvery, select } from 'redux-saga/effects'
import * as api from 'utils/api'
import * as actions from 'actions/eosAsset'
import { selectedEOSAssetSelector } from 'selectors/eosAsset'
import storage from 'utils/storage'

function* getEOSAssetRequested() {
  try {
    const data = yield call(api.getEOSAsset, {})
    yield put(actions.getEOSAssetSucceeded(data))
  } catch (e) {
    yield put(actions.getEOSAssetFailed(e.message))
  }
}

function* toggleEOSAsset() {
  const selectedEOSAsset = yield select((state: RootState) => selectedEOSAssetSelector(state))
  yield call(storage.setItem, 'bitportal_selectedEOSAsset', selectedEOSAsset.toJS(), true)
}

export default function* eosAssetSaga() {
  yield takeEvery(String(actions.getEOSAssetRequested), getEOSAssetRequested)
  yield takeEvery(String(actions.toggleEOSAsset), toggleEOSAsset)
}
