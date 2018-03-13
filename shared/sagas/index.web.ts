import { all, fork } from 'redux-saga/effects'
import { ENV } from 'constants/env'
import intlSaga from './intl'
import loggerSaga from './logger'

const sagas = {
  intlSaga: fork(intlSaga),
  loggerSaga: fork(loggerSaga)
}

if (ENV === 'production') {
  delete sagas.loggerSaga
}

export default function* rootSaga() {
  yield all(sagas)
}
