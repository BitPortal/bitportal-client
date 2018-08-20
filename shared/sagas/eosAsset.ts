import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/eosAsset'
import storage from 'utils/storage'

function* getEOSAsset(action: Action<GetEOSAssetParams>) {
  if (!action.payload) return

  try {
    const data = yield call(api.getEOSAsset, action.payload)
    data.forEach((item: any) => { item.value = false })
    yield put(actions.getEOSAssetSucceeded(data))
  } catch (e) {
    yield put(actions.getEOSAssetFailed(e.message))
  }
}

function* getAssetPref(action: Action<GetEOSAssetPrefParams>) {
  if (!action.payload) return
  const eosAccountName = action.payload.eosAccountName
  try {
    const eosAssetListInfo = yield call(storage.getItem, `EOS_ASSET_LIST_INFO_${eosAccountName}`, true)
    let EOS_ASSET_LIST = eosAssetListInfo && eosAssetListInfo.EOS_ASSET_LIST
    console.log('### --- getAssetPref', eosAccountName, EOS_ASSET_LIST)
    if (EOS_ASSET_LIST) {
      yield put(actions.getAssetPrefSucceeded(EOS_ASSET_LIST || []))
    }
  } catch (e) {
    console.log('getAssetPref error', e)
  }
}

function* saveAssetPref(action: Action<SaveEOSAssetPref>) {
  if (!action.payload) return

  const symbol = action.payload.symbol
  const value = action.payload.value
  const eosAccountName = action.payload.eosAccountName

  try {
    let eosAssetListInfo = yield call(storage.getItem, `EOS_ASSET_LIST_INFO_${eosAccountName}`, true)
    let EOS_ASSET_LIST = eosAssetListInfo && eosAssetListInfo.EOS_ASSET_LIST
    if (EOS_ASSET_LIST) {
      const found = EOS_ASSET_LIST.findIndex((item: any) => item.symbol === symbol)
      found !== -1
        ? (EOS_ASSET_LIST[found].value = value)
        : EOS_ASSET_LIST.push({ symbol, value })
    } else {
      EOS_ASSET_LIST = [{ symbol, value }]
    }
    yield call(storage.setItem, `EOS_ASSET_LIST_INFO_${eosAccountName}`, { EOS_ASSET_LIST }, true)
    yield put(actions.saveAssetPrefSucceeded(EOS_ASSET_LIST))
  } catch (e) {
    console.log('saveAssetPref error', e)
  }
}

export default function* eosAssetSaga() {
  yield takeEvery(String(actions.getEOSAssetRequested), getEOSAsset)
  yield takeEvery(String(actions.saveAssetPref), saveAssetPref)
  yield takeEvery(String(actions.getAssetPref), getAssetPref)
}
