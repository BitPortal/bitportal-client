import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/voting'
import { getEOSAccountRequested } from 'actions/eosAccount'
import { getEOSErrorMessage } from 'utils'
import { voteEOSProducers } from 'core/eos'

function* votingRequested(action: Action<VotingParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const producers = action.payload.producers
    const proxy = action.payload.proxy
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')

    yield call(voteEOSProducers, { eosAccountName, password, permission, producers, proxy })
    yield put(actions.votingSucceeded(producers))
    yield put(getEOSAccountRequested({ eosAccountName }))
  } catch (e) {
    yield put(actions.votingFailed(getEOSErrorMessage(e)))
  }
}

export default function* votingSaga() {
  yield takeEvery(String(actions.votingRequested), votingRequested)
}
