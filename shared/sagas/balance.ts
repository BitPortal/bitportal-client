import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/balance'
import { getErrorMessage } from 'utils'
import { initAccount } from 'core/eos'

function* getBalanceRequested(action: Action<BalanceParams>) {
  if (!action.payload) return

  try {
    const { eos } = yield call(initAccount, {})
    const data = yield call(eos.getCurrencyBalance, action.payload)
    const name = action.payload.account
    let balances = data.map((item: any) => {
      const symbol = item.split(' ')[1]
      const balance = item.split(' ')[0]
      const type = symbol === 'EOS' ? 'coin' : 'token'
      const platform = 'EOS'
      return { symbol, balance, type, platform }
    })
    if (!balances.length) balances = [{ symbol: 'SYS', balance: '0', type: 'token', platform: 'EOS' }]
    yield put(actions.getBalanceSucceeded({ name, balances }))
  } catch (e) {
    yield put(actions.getBalanceFailed(getErrorMessage(e)))
  }
}

export default function* balanceSaga() {
  yield takeEvery(String(actions.getBalanceRequested), getBalanceRequested)
}
