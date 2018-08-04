import Immutable from 'immutable'
import { delay } from 'redux-saga'
import { put, call, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/transfer'
import { getEOSAccountRequested } from 'actions/eosAccount'
import { getBalanceRequested } from 'actions/balance'
import { initEOS } from 'core/eos'
import { getEOSWifsByInfo } from 'core/key'
import secureStorage from 'utils/secureStorage'
import { getErrorMessage } from 'utils'
import { reset } from 'redux-form/immutable'
import { push } from 'utils/location'

function* transfer(action: Action<TransferParams>) {
  if (!action.payload) return

  try {
    const fromAccount = action.payload.fromAccount
    const toAccount = action.payload.toAccount
    const amount = action.payload.quantity
    const symbol = action.payload.symbol
    const quantity = `${(+amount).toFixed(4)} ${symbol}`
    const memo = action.payload.memo || ''
    const password = action.payload.password

    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${fromAccount}`, true)
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, [permission])
    const keyProvider = wifs.map((item: any) => item.wif)
    const eos = yield call(initEOS, { keyProvider })
    const transactionResult = yield call(eos.transfer, { quantity, memo, from: fromAccount, to: toAccount })

    yield put(actions.transferSucceeded(transactionResult))
    yield put(reset('transferAssetsForm'))
    yield put(actions.closeTransferModal())
    yield delay(500)

    if (action.payload.componentId) {
      push('BitPortal.TransactionRecord', action.payload.componentId, { transactionResult: Immutable.fromJS(transactionResult) })
    }
    yield put(getEOSAccountRequested({ eosAccountName: fromAccount }))
    yield put(getBalanceRequested({ code: 'eosio.token', account: fromAccount }))
  } catch (e) {
    yield put(actions.transferFailed(getErrorMessage(e)))
  }
}

export default function* transferSaga() {
  yield takeEvery(String(actions.transferRequested), transfer)
}
