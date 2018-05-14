import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/balance'
import { getEOS } from 'eos'

function* getBalanceRequested(action: Action<BalanceParams>) {
  if (!action.payload) return

  try {
    const eos = getEOS()
    const data = yield call(eos.getCurrencyBalance, action.payload)
    const name = action.payload.account
    const balances = data.map((item: any) => {
      const symbol = item.split(' ')[1]
      const balance = item.split(' ')[0]
      const type = symbol === 'EOS' ? 'coin' : 'token'
      const platform = 'EOS'
      return { symbol, balance, type, platform }
    })
    yield put(actions.getBalanceSucceeded({ name, balances }))
  } catch (e) {
    yield put(actions.getBalanceFailed(e.message))
  }
}

export default function* balanceSaga() {
  yield takeEvery(String(actions.getBalanceRequested), getBalanceRequested)
}
