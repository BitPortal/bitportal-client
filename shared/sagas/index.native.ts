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
import versionInfoSaga from './versionInfo'
import currencySaga from './currency'
import votingSaga from './voting'
import stakeSaga from './stake'
import transferSaga from './transfer'
import transactionSaga from './transaction'
import ramSaga from './ram'
import bandwidthSaga from './bandwidth'
import tokenSaga from './token'
import eosAssetSaga from './eosAsset'
import contactSaga from './contact'

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
  versionInfoSaga: fork(versionInfoSaga),
  currencySaga: fork(currencySaga),
  votingSaga: fork(votingSaga),
  stakeSaga: fork(stakeSaga),
  transferSaga: fork(transferSaga),
  transactionSaga: fork(transactionSaga),
  ramSaga: fork(ramSaga),
  bandwidthSaga: fork(bandwidthSaga),
  tokenSaga: fork(tokenSaga),
  eosAssetSaga: fork(eosAssetSaga),
  contactSaga: fork(contactSaga)
}

if (ENV === 'production') {
  delete sagas.loggerSaga
}

export default function* rootSaga() {
  yield all(sagas)
}
