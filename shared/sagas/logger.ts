import { select, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'

function* logger(action: Action<object>) {
  const newState = yield select()
  console.log('received action: ', action)
  console.log('state become: ', newState)
}

export default function* loggerSaga() {
  if (process.env.APP_ENV === 'pre' || process.env.APP_ENV === 'production') {
    console.log('Welcome DAE')
    return
  }
  yield takeEvery('*', logger)
}
