import assert from 'assert'
import { put, call, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/transaction'
import { initEOS } from 'core/eos'
import { getEOSWifsByInfo } from 'core/key'
import { getErrorMessage } from 'utils'

function* getTransactionsRequested(action: Action<TransactionsParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const position = action.payload.position
    const offset = action.payload.offset
    assert(eosAccountName, 'invalid eosAccountName')
    assert(typeof position === 'number', 'invalid position')
    assert(typeof offset === 'number', 'invalid offset')

    const eos = yield call(initEOS, {})
    const data = yield call(eos.getActions, { offset, account_name: eosAccountName, pos: position })

    const accountActions = data.actions.reverse().filter(action => action && action.action_trace && action.action_trace.receipt.receiver === eosAccountName)
    const hasMore = data.actions && data.actions.length === Math.abs(offset)
    const refresh = position === -1
    let newPosition = position
    if (hasMore) newPosition = +position + +offset

    yield put(actions.getTransactionsSucceeded({ hasMore, refresh, position: newPosition, actions: accountActions }))
  } catch (e) {
    yield put(actions.getTransactionsFailed(getErrorMessage(e)))
  }
}

function* getTransactionDetailRequested(action: Action<TransactionDetailParams>) {
  if (!action.payload) return

  try {
    const id = action.payload.id
    assert(id, 'invalid id')

    const eos = yield call(initEOS, {})
    const data = yield call(eos.getTransaction, { id })
    yield put(actions.getTransactionDetailSucceeded(data))
  } catch (e) {
    yield put(actions.getTransactionDetailFailed(getErrorMessage(e)))
  }
}

export default function* transactionSaga() {
  yield takeEvery(String(actions.getTransactionsRequested), getTransactionsRequested)
  yield takeEvery(String(actions.getTransactionDetailRequested), getTransactionDetailRequested)
}
