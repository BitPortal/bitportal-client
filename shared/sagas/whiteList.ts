import { call, put, takeEvery, select } from 'redux-saga/effects'
import * as actions from 'actions/whiteList'
import storage from 'utils/storage'
import Dialog from 'components/Dialog'
import Immutable from 'immutable'

function* noticeWhiteList(action: any) {
  try {
    const locale = yield select((state: any) => state.intl.get('locale'))
    const info = yield call(storage.getItem, 'bitportal_white_list', true)
    if (!!info) {
      yield put(actions.switchWhiteListSucceeded({ value: info.whiteListLuanched }))
    }

    const dappName = action.payload.dappName
    const dappUrl = action.payload.dappUrl
    const iconUrl = action.payload.iconUrl

    yield put(actions.recordDappInfo({ dappName, dappUrl, iconUrl }))
    if (!info || (!!info && !info.dappLuanched)) {
      const storeInfo = { dappLuanched: true }
      yield call(storage.mergeItem, 'bitportal_white_list', storeInfo, true)
      Dialog.whiteListAlert(
        '提示',
        'DApp白名单开关已经移置设置，新增了体验更流畅的高级模式，是否前往开启白名单功能？',
        locale,
        action.payload.componentId
      )
    }
  } catch (e) {
    
  }
}

function* switchWhiteList(action: any) {
  try {
    const storeInfo = { whiteListLuanched: action.payload.value }
    yield call(storage.mergeItem, 'bitportal_white_list', storeInfo, true)
    yield put(actions.switchWhiteListSucceeded({ value: action.payload.value }))
  } catch (e) {
    
  }
}

function* getWhiteListStoreInfo(action: any) {
  try {
    const store = yield call(storage.getItem, 'bitportal_white_list', true)
    console.log('###--yy  getWhiteListStoreInfo', store)
    if (!!store && !!store.dappList) {
      const index = store.dappList.findIndex((v: any) => {
        // 给每个dapp添加一个授权属性来判断是否有已经授权
        if (!v.authorized) {
          v.authorized = false
        }
        return v.dappName === action.payload.dappName
      })
      if (index !== -1) yield put(actions.initSelectedDapp(store.dappList[index]))
      console.log('###--yy  dappList', store.dappList)
      const dappList = yield select((state: RootState) => state.whiteList.get('dappList'))
      console.log('###--yy  dappList', dappList)
      if (!dappList.size) {
        yield put(actions.recordDappList({ dappList: Immutable.fromJS(store.dappList) }))
      }
    }
  } catch (e) {
    
  }
}

function* getDappListStoreInfo() {
  try {
    const store = yield call(storage.getItem, 'bitportal_white_list', true)
    if (!!store && !!store.dappList) yield put(actions.recordDappList({ dappList: Immutable.fromJS(store.dappList) }))
  } catch (e) {
    
  }
}

function* getWhiteListValue() {
  try {
    const store = yield call(storage.getItem, 'bitportal_white_list', true)
    if (!!store) {
      yield put(actions.switchWhiteListSucceeded({ value: store.whiteListLuanched }))
    }
  } catch (e) {
    
  }
}

function* resetSettingEnabled(action: any) {
  try {
    const value = action.payload.value
    const item = action.payload.item
    const dappList = yield select((state: RootState) => state.whiteList.get('dappList'))
    const index = dappList.findIndex((v: any) => v.get('dappName') === item.dappName)
    // console.log('###--yy updateWhiteListStoreInfo 85', index, dappList.get(index))
    if (index !== -1) {
      const reducerDappList = dappList.update(index, (v: any) => v.set('settingEnabled', value))
      // console.log('###--yy updateWhiteListStoreInfo 100', reducerDappList)
      yield put(actions.recordDappList({ dappList: reducerDappList }))

      const storeDappList: any = []
      reducerDappList.forEach((v: any) => storeDappList.push(v.delete('authorized').toJS()))
      console.log('###--yy updateWhiteListStoreInfo 107', storeDappList)
      yield call(storage.mergeItem, 'bitportal_white_list', { dappList: storeDappList }, true)
    } 
  } catch (e) {
    
  }
}

function* deleteContract(action: any) {
  try {
    const dappItem = action.payload.item
    const dappList = yield select((state: RootState) => state.whiteList.get('dappList'))

    const index = dappList.findIndex((v: any) => v.get('dappName') === dappItem.dappName)
    const storeDappList: any = []
    if (index !== -1) {
      const reducerDappList = dappList.delete(index)
      yield put(actions.recordDappList({ dappList: reducerDappList }))
      reducerDappList.forEach((v: any) => { storeDappList.push(v.delete('authorized').toJS()) })
      // console.log('###--yy deleteContract 123', reducerDappList.toJS(), storeDappList)
      yield call(storage.mergeItem, 'bitportal_white_list', { dappList: storeDappList }, true)
    } 
  } catch (e) {

  }
}

function* updateWhiteListStoreInfo(action: any) {
  try {
    const dappInfo = action.payload.store
    const dappList = yield select((state: RootState) => state.whiteList.get('dappList'))

    console.log('###--yy updateWhiteListStoreInfo 82', dappList.toJS(), dappInfo.toJS())    
    const index = dappList.findIndex((v: any) => v.get('dappName') === dappInfo.get('dappName'))
    const storeDappList: any = []
    if (index === -1) {
      const reducerDappList = dappList.push(Immutable.fromJS(dappInfo))
      // console.log('###--yy updateWhiteListStoreInfo 122', reducerDappList.toJS(), index)
      yield put(actions.recordDappList({ dappList: reducerDappList }))
      reducerDappList.forEach((v: any) => { storeDappList.push(v.delete('authorized').toJS()) })
    } else {
      const reducerDappList = dappList.update(index, () => dappInfo.set('authorized', true))
      // console.log('###--yy updateWhiteListStoreInfo 127', reducerDappList.toJS(), index)
      yield put(actions.recordDappList({ dappList: reducerDappList }))
      reducerDappList.forEach((v: any) => { storeDappList.push(v.delete('authorized').toJS()) })
    }
    yield call(storage.mergeItem, 'bitportal_white_list', { dappList: storeDappList }, true)
  } catch (e) {

  }
}

export default function* whiteListSaga() {
  yield takeEvery(String(actions.noticeWhiteList), noticeWhiteList)
  yield takeEvery(String(actions.switchWhiteListRequest), switchWhiteList)
  yield takeEvery(String(actions.getWhiteListValue), getWhiteListValue)
  yield takeEvery(String(actions.getWhiteListStoreInfo), getWhiteListStoreInfo)
  yield takeEvery(String(actions.getDappListStoreInfo), getDappListStoreInfo)
  yield takeEvery(String(actions.updateWhiteListStoreInfo), updateWhiteListStoreInfo)
  yield takeEvery(String(actions.resetSettingEnabled), resetSettingEnabled)
  yield takeEvery(String(actions.deleteContract), deleteContract)
}
