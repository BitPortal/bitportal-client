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

function* toggleEOSAssetForStorage(action: Action<any>) {
  if (!action.payload) return

  const toggledEOSAssetFromStorage = yield call(storage.getItem, 'bitportal_toggledEOSAsset', true)
  let toggledEOSAsset = toggledEOSAssetFromStorage || []
  const contract = action.payload.contract
  const symbol = action.payload.symbol
  const index = toggledEOSAsset.findIndex((v: any) => v.contract === contract && v.symbol === symbol)

  if (index !== -1) {
    toggledEOSAsset[index] = { ...action.payload, selected: !toggledEOSAsset[index].selected }
  } else {
    toggledEOSAsset.push({ ...action.payload, selected: true })
    toggledEOSAsset = toggledEOSAsset.sort((a: any, b: any) => a.symbol < b.symbol)
  }

  yield call(storage.setItem, 'bitportal_toggledEOSAsset', toggledEOSAsset, true)
}

export default function* eosAssetSaga() {
  yield takeEvery(String(actions.getEOSAssetRequested), getEOSAssetRequested)
  yield takeEvery(String(actions.toggleEOSAsset), toggleEOSAsset)
  yield takeEvery(String(actions.toggleEOSAssetForStorage), toggleEOSAssetForStorage)
  yield takeEvery(String(actions.toggleEOSAssetList), toggleEOSAsset)
  yield takeLatest(String(actions.searchEOSAssetRequested), searchEOSAssetRequested)
}
