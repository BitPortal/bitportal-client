import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import * as actions from 'actions/asset'
import * as api from 'utils/api'

function* getETHAsset(action: Action) {
  try {
    const result = yield call(api.getETHAsset)
    yield put(actions.updateETHAsset(result))
    yield put(actions.getETHAsset.succeeded())
  } catch (e) {
    yield put(actions.getETHAsset.failed(getErrorMessage(e)))
  }
}

function* getEOSAsset(action: Action) {
  try {
    const result = yield call(api.getEOSAsset)
    yield put(actions.updateEOSAsset(result))
    yield put(actions.getEOSAsset.succeeded())
  } catch (e) {
    yield put(actions.getEOSAsset.failed(getErrorMessage(e)))
  }
}

export default function* assetSaga() {
  yield takeLatest(String(actions.getETHAsset.requested), getETHAsset)
  yield takeLatest(String(actions.getEOSAsset.requested), getEOSAsset)
}
