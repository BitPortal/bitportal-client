// import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/bandwidth'
import { getEOSAccountRequested } from 'actions/eosAccount'
import { initEOS } from 'eos'
import { getEOSWifsByInfo } from 'key'
import secureStorage from 'utils/secureStorage'
import { reset } from 'redux-form/immutable'

function* delegateBandwidthRequested(action: Action<DelegateBandwidthParams>) {
  if (!action.payload) return

  try {
    yield delay(500)
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const quant = action.payload.quant
    const resource = action.payload.resource
    const netQuantity = resource === 'net' ? `${quant} EOS` : '0.0000 EOS'
    const cpuQuantity = resource === 'cpu' ? `${quant} EOS` : '0.0000 EOS'
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, ['active'])
    const activeWifs = wifs.activeWifs

    const eos = initEOS({
      keyProvider: activeWifs
    })

    const result = yield call(
      eos.transaction,
      (tr: any) => {
        console.log(tr)
        tr.delegatebw({
          from: eosAccountName,
          receiver: eosAccountName,
          stake_net_quantity: netQuantity,
          stake_cpu_quantity: cpuQuantity,
          transfer: 0
        })
      }
    )
    console.log(result)
    yield put(actions.delegateBandwidthSucceeded({}))
    yield put(reset('delegateBandwidthForm'))
    yield put(getEOSAccountRequested({ eosAccountName }))
  } catch (e) {
    yield put(actions.delegateBandwidthFailed(e.message))
  }
}

function* undelegateBandwidthRequested(action: Action<UndelegateBandwidthResult>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const password = action.payload.password
    const quant = action.payload.quant
    const resource = action.payload.resource
    const netQuantity = resource === 'net' ? `${quant} EOS` : '0.0000 EOS'
    const cpuQuantity = resource === 'cpu' ? `${quant} EOS` : '0.0000 EOS'
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, ['active'])
    const activeWifs = wifs.activeWifs

    const eos = initEOS({
      keyProvider: activeWifs
    })

    const result = yield call(
      eos.transaction,
      (tr: any) => {
        console.log(tr)
        tr.undelegatebw({
          from: eosAccountName,
          receiver: eosAccountName,
          stake_net_quantity: netQuantity,
          stake_cpu_quantity: cpuQuantity,
          transfer: 0
        })
      }
    )
    console.log(result)
    yield put(actions.undelegateBandwidthSucceeded({}))
    yield put(reset('delegateBandwidthForm'))
    yield put(getEOSAccountRequested({ eosAccountName }))
  } catch (e) {
    yield put(actions.undelegateBandwidthFailed(e.message))
  }
}

export default function* bandwidthSaga() {
  yield takeEvery(String(actions.delegateBandwidthRequested), delegateBandwidthRequested)
  yield takeEvery(String(actions.undelegateBandwidthRequested), undelegateBandwidthRequested)
}
