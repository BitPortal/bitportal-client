import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/eosAsset'

import storage from 'utils/storage'

function* getEOSAsset(action: Action<GetEOSAssetParams>) {
  if (!action.payload) return

  try {
    const data = yield call(api.getEOSAsset, action.payload)
    data.forEach((item: any) => {
      item.value = false
    })
    yield put(actions.getEOSAssetSucceeded(data))
  } catch (e) {
    yield put(actions.getEOSAssetFailed(e.message))
  }
}

function* getAssetPref() {
  try {
    const eosAssetListPrefs = yield call(
      storage.getItem,
      'eosAssetListPrefs',
      true
    )
    yield put(actions.getAssetPrefSucceeded(eosAssetListPrefs || []))
  } catch (e) {
    console.log('getAssetPref error', e)
  }
}

function* saveAssetPref(action: Action<SaveEOSAssetPref>) {
  if (!action.payload) return

  const symbol = action.payload.symbol
  const value = action.payload.value

  try {
    let eosAssetListPrefs = yield call(
      storage.getItem,
      'eosAssetListPrefs',
      true
    )
    if (eosAssetListPrefs) {
      const found = eosAssetListPrefs.findIndex(
        (item: any) => item.symbol === symbol
      )
      found !== -1
        ? (eosAssetListPrefs[found].value = value)
        : eosAssetListPrefs.push({
          symbol,
          value
        })
    } else {
      eosAssetListPrefs = [
        {
          symbol,
          value
        }
      ]
    }
    yield call(storage.setItem, 'eosAssetListPrefs', eosAssetListPrefs, true)
    yield put(actions.saveAssetPrefSucceeded(eosAssetListPrefs))
  } catch (e) {
    console.log('saveAssetPref error', e)
  }
}

export default function* eosAssetSaga() {
  yield takeEvery(String(actions.getEOSAssetRequested), getEOSAsset)
  yield takeEvery(String(actions.saveAssetPref), saveAssetPref)
  yield takeEvery(String(actions.getAssetPref), getAssetPref)
}
