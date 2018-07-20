import { put, call, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/transfer'
import { getEOSAccountRequested } from 'actions/eosAccount'
import { getBalanceRequested } from 'actions/balance'
import { initEOS } from 'core/eos'
import { getEOSWifsByInfo } from 'core/key'
import secureStorage from 'utils/secureStorage'

function* transfer(action: Action<TransferParams>) {
  if (!action.payload) return

  try {
    console.log(action.payload)

    const fromAccount = action.payload.fromAccount
    const toAccount = action.payload.toAccount
    const quantity = action.payload.quantity
    const memo = action.payload.memo
    const password = action.payload.password
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${fromAccount}`, true)
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, ['active'])
    const activeWifs = wifs.activeWifs

    const eos = yield call(initEOS, { keyProvider: activeWifs })
    yield call(eos.transfer, { quantity, memo, from: fromAccount, to: toAccount })
    yield put(actions.transferSucceeded())
    yield put(getEOSAccountRequested({ eosAccountName: fromAccount }))
    yield put(getBalanceRequested({ code: 'eosio.token', account: fromAccount }))
  } catch (e) {
    yield put(actions.transferFailed(e.message))
  }
}

export default function* transferSaga() {
  yield takeEvery(String(actions.transferRequested), transfer)
}
