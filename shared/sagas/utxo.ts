import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import * as actions from 'actions/utxo'
import { updateBalance, getBalance } from 'actions/balance'
import * as btcChain from 'core/chain/bitcoin'

function* getUTXO(action: Action) {
  if (!action.payload) return

  try {
    const { addresses, walletId, id, chain, symbol, precision } = action.payload
    const utxo = yield call(btcChain.getUTXO, addresses)
    yield put(actions.updateUTXO({ utxo, walletId, id, chain, symbol, precision }))
    yield put(actions.getUTXO.succeeded({ utxo, walletId, id, chain, symbol, precision }))
  } catch (e) {
    yield put(actions.getUTXO.failed(getErrorMessage(e)))
  }
}

function* getUTXOSucceeded(action: Action) {
  if (!action.payload) return

  const { utxo, walletId, id, chain, symbol, precision } = action.payload

  const balance = yield call(btcChain.calculateBalanceFromUTXO, utxo)
  yield put(updateBalance({ id, chain, balance, symbol, precision }))
  yield put(getBalance.succeeded({ walletId, balance }))
}

export default function* utxoSaga() {
  yield takeLatest(String(actions.getUTXO.requested), getUTXO)
  yield takeLatest(String(actions.getUTXO.succeeded), getUTXOSucceeded)
}
