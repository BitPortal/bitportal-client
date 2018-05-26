import { all, fork } from 'redux-saga/effects'
import { ENV } from 'constants/env'
import intlSaga from './intl'
import tickerSaga from './ticker'
import chartSaga from './chart'
import walletSaga from './wallet'
import eosAccountSaga from './eosAccount'
import loggerSaga from './logger'
import newsSage from './news'

const sagas = {
  intlSaga: fork(intlSaga),
  tickerSaga: fork(tickerSaga),
  chartSaga: fork(chartSaga),
  walletSaga: fork(walletSaga),
  eosAccountSaga: fork(eosAccountSaga),
  loggerSaga: fork(loggerSaga),
  newsSaga: fork(newsSage)
}

if (ENV === 'production') {
  delete sagas.loggerSaga
}

export default function* rootSaga() {
  yield all(sagas)
}
