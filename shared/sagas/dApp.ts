import { call, put, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/dApp'
import { favoriteDappsSelector } from 'selectors/dApp'
import storage from 'utils/storage'

function* getDappList(action: Action<TokenParams>) {
  try {
    const data = yield call(api.getDappList, { ...action.payload, _sort: 'display_priority:desc' })
    yield put(actions.getDappListSucceeded(data))
  } catch (e) {
    yield put(actions.getDappListFailed(e.message))
  }
}

function* toggleFavoriteDapp() {
  const favoriteDappsArray = yield select((state: RootState) => favoriteDappsSelector(state)
  )
  yield call(
    storage.setItem,
    'bitportal_favoriteDapps',
    favoriteDappsArray.toJS(),
    true
  )
}

export default function* dAppSaga() {
  yield takeEvery(String(actions.getDappListRequested), getDappList)
  yield takeEvery(String(actions.toggleFavoriteDapp), toggleFavoriteDapp)
}
