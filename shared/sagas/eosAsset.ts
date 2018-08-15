import { call, put, takeEvery, select, all } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/eosAsset'

import storage from 'utils/storage'

function* getEosAsset(action: Action<eosAssetParams>) {
  // if (!action.payload) return

  try {
    const [data, eosAssetListPrefs] = yield all([
      call(api.getEosAsset, action.payload),
      call(storage.getItem, 'eosAssetListPrefs', true)
    ])
    data.forEach((item: any) => {
      item.value = false
    })
    // }
    yield put(actions.getEosAssetSucceeded(data))
  } catch (e) {
    yield put(actions.getEosAssetFailed(e.message))
  }
}

function* getAssetPref(action: Action<eosAssetParams>) {
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

function* saveAssetPref(action: Action<eosAssetPref>) {
  try {
    let eosAssetListPrefs = yield call(
      storage.getItem,
      'eosAssetListPrefs',
      true
    )
    if (eosAssetListPrefs) {
      const found = eosAssetListPrefs.findIndex(
        (item: any) => item.symbol === action.payload.item.get('symbol')
      )
      found !== -1
        ? (eosAssetListPrefs[found].value = action.payload.value)
        : eosAssetListPrefs.push({
          symbol: action.payload.item.get('symbol'),
          value: action.payload.value
        })
    } else {
      eosAssetListPrefs = [
        {
          symbol: action.payload.item.get('symbol'),
          value: action.payload.value
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
  yield takeEvery(String(actions.getEosAssetRequested), getEosAsset)
  yield takeEvery(String(actions.saveAssetPref), saveAssetPref)
  yield takeEvery(String(actions.getAssetPref), getAssetPref)
}
