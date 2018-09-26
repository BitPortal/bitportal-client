import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, takeEvery, select } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/bandwidth'
import { getEOSAccountRequested } from 'actions/eosAccount'
import { initEOS } from 'core/eos'
import { getEOSWifsByInfo } from 'core/key'
import secureStorage from 'utils/secureStorage'
import { reset } from 'redux-form/immutable'
import { getEOSErrorMessage } from 'utils'
import { traceStake } from 'actions/trace'

function* delegateBandwidthRequested(action: Action<DelegateBandwidthParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const quant = action.payload.quant
    assert(quant, 'Invalid quant!')
    const asset = (+quant).toFixed(4)
    const resource = action.payload.resource
    const netQuantity = resource === 'net' ? `${asset} EOS` : '0.0000 EOS'
    const cpuQuantity = resource === 'cpu' ? `${asset} EOS` : '0.0000 EOS'
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, [permission])
    const keyProvider = wifs.map((item: any) => item.wif)
    const eos = yield call(initEOS, { keyProvider })

    yield call(
      eos.transaction,
      (tr: any) => tr.delegatebw({
        from: eosAccountName,
        receiver: eosAccountName,
        stake_net_quantity: netQuantity,
        stake_cpu_quantity: cpuQuantity,
        transfer: 0
      })
    )

    yield put(actions.delegateBandwidthSucceeded({}))
    yield put(reset('delegateBandwidthForm'))
    yield put(getEOSAccountRequested({ eosAccountName }))
    yield delay(2000)
    yield put(getEOSAccountRequested({ eosAccountName }))

    // trace stake
    const traceParams = {
      userId: null,
      walletId: eosAccountName,
      type: 'stake',
      assetType: resource === 'net' ? 'NET' : 'CPU',
      amount: asset
    }
    yield put(traceStake(traceParams))

  } catch (e) {
    yield put(actions.delegateBandwidthFailed(getEOSErrorMessage(e)))
  }
}

function* undelegateBandwidthRequested(action: Action<UndelegateBandwidthParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const quant = action.payload.quant
    assert(quant, 'Invalid quant!')
    const asset = (+quant).toFixed(4)
    const resource = action.payload.resource
    const netQuantity = resource === 'net' ? `${asset} EOS` : '0.0000 EOS'
    const cpuQuantity = resource === 'cpu' ? `${asset} EOS` : '0.0000 EOS'
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, [permission])
    const keyProvider = wifs.map((item: any) => item.wif)
    const eos = yield call(initEOS, { keyProvider })

    yield call(
      eos.transaction,
      (tr: any) => tr.undelegatebw({
        from: eosAccountName,
        receiver: eosAccountName,
        unstake_net_quantity: netQuantity,
        unstake_cpu_quantity: cpuQuantity,
        transfer: 0
      })
    )

    yield put(actions.undelegateBandwidthSucceeded({}))
    yield put(reset('delegateBandwidthForm'))
    yield put(getEOSAccountRequested({ eosAccountName }))

    // trace stake
    const traceParams = {
      userId: null,
      walletId: eosAccountName,
      type: 'unstake',
      assetType: resource === 'net' ? 'NET' : 'CPU',
      amount: asset
    }
    yield put(traceStake(traceParams))

  } catch (e) {
    yield put(actions.undelegateBandwidthFailed(getEOSErrorMessage(e)))
  }
}

export default function* bandwidthSaga() {
  yield takeEvery(String(actions.delegateBandwidthRequested), delegateBandwidthRequested)
  yield takeEvery(String(actions.undelegateBandwidthRequested), undelegateBandwidthRequested)
}
