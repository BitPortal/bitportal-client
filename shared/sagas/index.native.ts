import { all, fork } from 'redux-saga/effects'
import { ENV } from 'constants/env'
import formSaga from './form'
import intlSaga from './intl'
import loggerSaga from './logger'
import producerSage from './producer'
import identitySaga from './identity'
import walletSaga from './wallet'
import balanceSaga from './balance'
import tickerSaga from './ticker'
import accountSaga from './account'
import dappSaga from './dapp'
import transactionSaga from './transaction'
import addressSaga from './address'
import utxoSaga from './utxo'

const sagas = {
  formSaga: fork(formSaga),
  intlSaga: fork(intlSaga),
  loggerSaga: fork(loggerSaga),
  producerSage: fork(producerSage),
  identitySaga: fork(identitySaga),
  walletSaga: fork(walletSaga),
  balanceSaga: fork(balanceSaga),
  tickerSaga: fork(tickerSaga),
  accountSaga: fork(accountSaga),
  dappSaga: fork(dappSaga),
  transactionSaga: fork(transactionSaga),
  addressSaga: fork(addressSaga),
  utxoSaga: fork(utxoSaga)
}

if (ENV === 'production') {
  delete sagas.loggerSaga
}

export default function* rootSaga() {
  yield all(sagas)
}
