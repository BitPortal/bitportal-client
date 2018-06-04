import { all, fork } from 'redux-saga/effects'
import { ENV } from 'constants/env'
import intlSaga from './intl'
import tickerSaga from './ticker'
import chartSaga from './chart'
import walletSaga from './wallet'
import eosAccountSaga from './eosAccount'
import keystoreSaga from './keystore'
import balanceSaga from './balance'
import loggerSaga from './logger'
import newsSage from './news'
import voteSage from './vote'
import versionInfoSaga from './versionInfo'

const sagas = {
  intlSaga: fork(intlSaga),
  tickerSaga: fork(tickerSaga),
  chartSaga: fork(chartSaga),
  walletSaga: fork(walletSaga),
  eosAccountSaga: fork(eosAccountSaga),
  keystoreSaga: fork(keystoreSaga),
  newsSage: fork(newsSage),
  balanceSaga: fork(balanceSaga),
  loggerSaga: fork(loggerSaga),
  voteSage: fork(voteSage),
  versionInfoSaga: fork(versionInfoSaga)
}

if (ENV === 'production') {
  delete sagas.loggerSaga
}

export default function* rootSaga() {
  yield all(sagas)
}
