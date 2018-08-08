import assert from 'assert'
import { put, call, takeEvery, takeLatest } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/transaction'
import { initEOS } from 'core/eos'
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

    const hasMore = data.actions && data.actions.length && !!data.actions[0].account_action_seq
    const accountActions = (hasMore ? [...data.actions.slice(2)] : [...data.actions]).reverse().filter((action: any) => action && action.action_trace && action.action_trace.receipt.receiver === eosAccountName)
    const refresh = position === -1
    let newPosition = data.actions.length ? (data.actions[0].account_action_seq + 1) : position

    yield put(actions.getTransactionsSucceeded({ hasMore, refresh, position: newPosition, actions: accountActions, lastIrreversibleBlock: data.last_irreversible_block }))
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
  yield takeLatest(String(actions.getTransactionsRequested), getTransactionsRequested)
  yield takeEvery(String(actions.getTransactionDetailRequested), getTransactionDetailRequested)
}
