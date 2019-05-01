import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import * as actions from 'actions/fee'
import * as api from 'utils/api'
import * as ethChain from 'core/chain/etheruem'

function* getBTCFees(action: Action) {
  try {
    const result = yield call(api.getBTCFees)
    yield put(actions.updateBTCFees(result))
    yield put(actions.getBTCFees.succeeded())
  } catch (e) {
    yield put(actions.getBTCFees.failed(getErrorMessage(e)))
  }
}

function* getETHGasPrice(action: Action) {
  try {
    const result = yield call(ethChain.getETHGasPrice)
    yield put(actions.updateETHGasPrice(result))
    yield put(actions.getETHGasPrice.succeeded())
  } catch (e) {
    yield put(actions.getETHGasPrice.failed(getErrorMessage(e)))
  }
}

export default function* feeSaga() {
  yield takeLatest(String(actions.getBTCFees.requested), getBTCFees)
  yield takeLatest(String(actions.getETHGasPrice.requested), getETHGasPrice)
}
