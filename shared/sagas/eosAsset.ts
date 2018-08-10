import { call, put, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/eosAsset'

function* getEosAsset(action: Action<eosAssetParams>) {
  // if (!action.payload) return

  try {
    const data = yield call(api.getEosAsset, action.payload)
    yield put(actions.getEosAssetSucceeded(data))
  } catch (e) {
    yield put(actions.getEosAssetFailed(e.message))
  }
}

export default function* eosAssetSaga() {
  yield takeEvery(String(actions.getEosAssetRequested), getEosAsset)
}
