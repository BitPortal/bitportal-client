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
import producerSage from './producer'
import currencySaga from './currency'
import votingSaga from './voting'
import transferSaga from './transfer'
import transactionSaga from './transaction'
import ramSaga from './ram'
import bandwidthSaga from './bandwidth'
import tokenSaga from './token'
import contactSaga from './contact'
import eosNodeSaga from './eosNode'

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
  producerSage: fork(producerSage),
  currencySaga: fork(currencySaga),
  votingSaga: fork(votingSaga),
  transferSaga: fork(transferSaga),
  transactionSaga: fork(transactionSaga),
  ramSaga: fork(ramSaga),
  bandwidthSaga: fork(bandwidthSaga),
  tokenSaga: fork(tokenSaga),
  contactSaga: fork(contactSaga),
  eosNodeSaga: fork(eosNodeSaga)
}

if (ENV === 'production') {
  delete sagas.loggerSaga
}

export default function* rootSaga() {
  yield all(sagas)
}
