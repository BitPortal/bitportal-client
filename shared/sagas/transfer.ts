import Immutable from 'immutable'
import { delay } from 'redux-saga'
import { put, call, select, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/transfer'
import { getEOSAccountRequested } from 'actions/eosAccount'
import { getEOSBalanceRequested, getEOSAssetBalanceRequested } from 'actions/balance'
import { transferEOSAsset } from 'core/eos'
import { getEOSErrorMessage } from 'utils'
import { reset } from 'redux-form/immutable'
import { push } from 'utils/location'
import { traceTransaction } from 'actions/trace'

function* transfer(action: Action<TransferParams>) {
  if (!action.payload) return

  try {
    const fromAccount = action.payload.fromAccount
    const toAccount = action.payload.toAccount
    const amount = action.payload.quantity
    const symbol = action.payload.symbol
    const precision = action.payload.precision
    const memo = action.payload.memo
    const password = action.payload.password
    const contract = action.payload.contract
    // const permission = action.payload.permission
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const transactionResult = yield call(transferEOSAsset, { fromAccount, toAccount, amount, symbol, precision, memo, password, contract, permission })
    yield put(actions.transferSucceeded(transactionResult))
    yield put(reset('transferAssetsForm'))
    yield put(actions.closeTransferModal())
    yield delay(500)

    if (action.payload.componentId) {
      push('BitPortal.TransactionRecord', action.payload.componentId, { transactionResult: Immutable.fromJS(transactionResult) })
    }
    yield put(getEOSAccountRequested({ eosAccountName: fromAccount }))

    if (contract === 'eosio.token') {
      yield put(getEOSBalanceRequested({ eosAccountName: fromAccount }))
    } else {
      yield put(getEOSAssetBalanceRequested({ symbol, code: contract, eosAccountName: fromAccount }))
    }

    // trace transaction
    const traceParams = {
      amount,
      userId: null,
      walletId: fromAccount,
      assetType: symbol,
      toAddr: toAccount
    }
    yield put(traceTransaction(traceParams))
    
  } catch (e) {
    yield put(actions.transferFailed(getEOSErrorMessage(e)))
  }
}

export default function* transferSaga() {
  yield takeEvery(String(actions.transferRequested), transfer)
}
