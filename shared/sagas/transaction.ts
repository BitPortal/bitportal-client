import assert from 'assert'
import { select, put, call, takeEvery, takeLatest } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/transaction'
import { activeAssetTransactionsSelector } from 'selectors/transaction'
import { eosAccountNameSelector } from 'selectors/eosAccount'
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
    const newPosition = data.actions.length ? (data.actions[0].account_action_seq + 1) : position

    yield put(actions.getTransactionsSucceeded({ hasMore, refresh, position: newPosition, actions: accountActions, lastIrreversibleBlock: data.last_irreversible_block }))
  } catch (e) {
    yield put(actions.getTransactionsFailed(getErrorMessage(e)))
  }
}

function* getTransactionsSucceeded(action: Action<TransactionsResult>) {
  if (!action.payload) return

  const hasMore = action.payload.hasMore

  if (hasMore) {
    const loadAll =  yield select((state: RootState) => state.transaction.get('loadAll'))

    if (!loadAll) {
      const activeAssetTransactions = yield select((state: RootState) => activeAssetTransactionsSelector(state))

      if (!activeAssetTransactions.size) {
        const eosAccountName = yield select((state: RootState) => eosAccountNameSelector(state))
        const offset =  yield select((state: RootState) => state.transaction.get('offset'))
        const position = yield select((state: RootState) => state.transaction.get('position'))
        yield put(actions.getTransactionsRequested({ eosAccountName, offset, position }))
      }
    }
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
  yield takeLatest(String(actions.getTransactionsSucceeded), getTransactionsSucceeded)
  yield takeEvery(String(actions.getTransactionDetailRequested), getTransactionDetailRequested)
}
