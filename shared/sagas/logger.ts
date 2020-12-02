import { select, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'

function* logger(action: Action<object>) {
  const newState = yield select()
  if (__DEV__) {
    console.log('received action: ', action)
    console.log('state become: ', newState)
  }
}

export default function* loggerSaga() {
  yield takeEvery('*', logger)
}
