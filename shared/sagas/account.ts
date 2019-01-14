import assert from 'assert'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import * as actions from 'actions/account'
import * as eosChain from 'core/chain/eos'

function* getAccount(action: Action) {
  if (!action.payload) return

  try {
    const chain = action.payload.chain
    const address = action.payload.address

    let id = `${chain}/${address}`

    if (chain === 'EOS') {
      const result = yield call(eosChain.getAccount, address)
      result.id = id
      yield put(actions.updateAccount(result))
    }

    yield put(actions.getAccount.succeeded())
  } catch (e) {
    yield put(actions.getAccount.failed(getErrorMessage(e)))
  }
}

export default function* balanceSaga() {
  yield takeLatest(String(actions.getAccount.requested), getAccount)
  yield takeLatest(String(actions.getAccount.refresh), getAccount)
}
