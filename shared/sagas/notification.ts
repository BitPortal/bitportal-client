import { call, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/notification'

function* subscribe(action: Action<SubscribeParams>) {
  if (!action.payload) return

  try {
    const data = yield call(api.subscribe, action.payload)
    console.log('###--11', data)
  } catch (e) {
    console.log('###--13', e)
  }
}

function* unsubscribe(action: Action<UnsubscribeParams>) {
  if (!action.payload) return

  try {
    const data = yield call(api.unsubscribe, action.payload)
    console.log('###--22', data)
  } catch (e) {
    console.log('###--24', e)
  }
}

export default function* tokenSaga() {
  yield takeEvery(String(actions.subscribe), subscribe)
  yield takeEvery(String(actions.unsubscribe), unsubscribe)
}
