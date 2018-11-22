import { call, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as api from 'utils/api'
import * as actions from 'actions/trace'

function* traceTransaction(action: Action<TraceTransactionParams>) {
  if (!action.payload) return

  try {
    yield call(api.traceTransaction, action.payload)
  } catch (e) {
    console.log('###', e)
  }
}

function* traceStake(action: Action<TraceStakeParams>) {
  if (!action.payload) return

  try {
    yield call(api.traceStake, action.payload)
  } catch (e) {
    console.log('###', e)
  }
}

function* traceVotes(action: Action<TraceVotesParams>) {
  if (!action.payload) return

  try {
    yield call(api.traceVotes, action.payload)
  } catch (e) {
    console.log('###', e)
  }
}

function* traceImport(action: Action<TraceVotesParams>) {
  if (!action.payload) return

  try {
    yield call(api.traceImport, action.payload)
  } catch (e) {
    console.log('###', e)
  }
}

export default function* tokenSaga() {
  yield takeEvery(String(actions.traceTransaction), traceTransaction)
  yield takeEvery(String(actions.traceStake), traceStake)
  yield takeEvery(String(actions.traceVotes), traceVotes)
  yield takeEvery(String(actions.traceImport), traceImport)
}
