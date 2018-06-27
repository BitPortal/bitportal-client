import { all, fork } from 'redux-saga/effects'
import { ENV } from 'constants/env'
import intlSaga from './intl'
import tickerSaga from './ticker'
import chartSaga from './chart'
import walletSaga from './wallet'
import eosAccountSaga from './eosAccount'
import loggerSaga from './logger'
import newsSage from './news'
import producerSage from './producer'
import balanceSaga from './balance'
import keystoreSaga from './keystore'
import votingSaga from './voting'
import stakeSaga from './stake'
import transferSaga from './transfer'
import transferHistorySaga from './transferHistory'
import ramSaga from './ram'

const sagas = {
  intlSaga: fork(intlSaga),
  tickerSaga: fork(tickerSaga),
  chartSaga: fork(chartSaga),
  walletSaga: fork(walletSaga),
  eosAccountSaga: fork(eosAccountSaga),
  keystoreSaga: fork(keystoreSaga),
  newsSaga: fork(newsSage),
  balanceSaga: fork(balanceSaga),
  loggerSaga: fork(loggerSaga),
  producerSage: fork(producerSage),
  votingSaga: fork(votingSaga),
  stakeSaga: fork(stakeSaga),
  transferSaga: fork(transferSaga),
  transferHistorySaga: fork(transferHistorySaga),
  ramSaga: fork(ramSaga)
}

if (ENV === 'production') {
  delete sagas.loggerSaga
}

export default function* rootSaga() {
  yield all(sagas)
}
