import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/simpleWallet'
import { eosAuthSign } from 'core/eos'
import * as api from 'utils/api'
import { getErrorMessage } from 'utils'

function* loginSWAuthRequested(action: Action<LoginSWAuthParams>) {
  console.log('loginSWAUth', action.payload)
  if (!action.payload) return
  try {
    const { eosAccountName, timestamp, ref, uuID, loginUrl, password, wallet, protocol, version } = action.payload
    const publicKey = wallet.get(0).get('publicKey')
    const signData = `${timestamp + eosAccountName + uuID}BitPortal`
    const sign = yield call(eosAuthSign, { account: eosAccountName, publicKey, password, signData, isHash: false })
    const params = { protocol, version, timestamp, sign, uuID, account: eosAccountName, ref }
    const result = yield call(api.simpleWalletAuth, params, loginUrl)
    console.log('resultt', result)
    if (!result) yield put(actions.loginSWAuthFailed('error'))
    else if (result.code === 1) yield put(actions.loginSWAuthFailed('error'))
    else if (result.code === 0) {
      yield put(actions.loginSWAuthSucceeded(params))
    }
  } catch (error) {
    yield put(actions.loginSWAuthFailed(getErrorMessage(error)))
    console.log('error', error)
  }
}

// function* transactionSWRequested(action: Action<transactionSWParams>) {
//   if (!action.payload) return
//   try {
//   } catch (error) {}
// }

export default function* simpleWalletSaga() {
  yield takeEvery(String(actions.loginSWAuthRequested), loginSWAuthRequested)
  // yield takeEvery(String(actions.transactionSWRequested), transactionSWRequested)
}
