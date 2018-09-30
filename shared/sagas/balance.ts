import assert from 'assert'
import { select, call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/balance'
import { selectedEOSAssetSelector } from 'selectors/eosAsset'
import { getErrorMessage } from 'utils'
import { BITPORTAL_API_EOS_URL } from 'constants/env'
import { initEOS } from 'core/eos'

function* getEOSBalanceRequested(action: Action<GetAssetBalanceParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const code = 'eosio.token'

    const eosAccountCreationInfo = yield select((state: RootState) => state.eosAccount.get('eosAccountCreationInfo'))
    const useCreationServer = eosAccountCreationInfo.get('transactionId') && eosAccountCreationInfo.get('eosAccountName') === eosAccountName && !eosAccountCreationInfo.get('irreversible')
    const eos = yield call(initEOS, useCreationServer ? { httpEndpoint: BITPORTAL_API_EOS_URL } : {})

    const data = yield call(eos.getCurrencyBalance, { code, account: eosAccountName })
    assert(data && data[0] && typeof data[0] === 'string', 'No balance!')

    const symbol = data[0].split(' ')[1]
    const balance = data[0].split(' ')[0]
    const blockchain = 'EOS'
    const contract = code
    const balanceInfo = { symbol, balance, contract, blockchain }
    yield put(actions.getEOSBalanceSucceeded({ eosAccountName, balanceInfo }))
  } catch (e) {
    yield put(actions.getEOSBalanceFailed(getErrorMessage(e)))
  }
}

function* getEOSAssetBalanceRequested(action: Action<GetAssetBalanceParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    const code = action.payload.code
    const symbol = action.payload.symbol

    const eosAccountCreationInfo = yield select((state: RootState) => state.eosAccount.get('eosAccountCreationInfo'))
    const useCreationServer = eosAccountCreationInfo.get('transactionId') && eosAccountCreationInfo.get('eosAccountName') === eosAccountName && !eosAccountCreationInfo.get('irreversible')
    const eos = yield call(initEOS, useCreationServer ? { httpEndpoint: BITPORTAL_API_EOS_URL } : {})

    const data = yield call(eos.getCurrencyBalance, { code, account: eosAccountName })
    assert(data && data.length, 'No balance!')
    const balanceData = data.filter((item: string) => item.split(' ')[1] === symbol)
    assert(balanceData.length, 'No balance!')

    const balance = balanceData[0].split(' ')[0]
    const blockchain = 'EOS'
    const contract = code
    const balanceInfo = { symbol, balance, contract, blockchain }
    yield put(actions.getEOSAssetBalanceSucceeded({ eosAccountName, balanceInfo }))
  } catch (e) {
    yield put(actions.getEOSAssetBalanceFailed(getErrorMessage(e)))
  }
}

function* getEOSAssetBalanceListRequested(action: Action<GetAssetBalanceListParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName

    // const eosAccountCreationInfo = yield select((state: RootState) => state.eosAccount.get('eosAccountCreationInfo'))
    // const useCreationServer = eosAccountCreationInfo.get('transactionId') && eosAccountCreationInfo.get('eosAccountName') === eosAccountName && !eosAccountCreationInfo.get('irreversible')
    // const eos = yield call(initEOS, useCreationServer ? { httpEndpoint: BITPORTAL_API_EOS_URL } : {})

    const selectedEOSAssetList = yield select((state: RootState) => selectedEOSAssetSelector(state))
    const selectedEOSAssetListArray = selectedEOSAssetList.toJS()
    for (const asset of selectedEOSAssetListArray) {
      yield put(actions.getEOSAssetBalanceRequested({ eosAccountName, code: asset.contract, symbol: asset.symbol }))
    }
    // const data = yield all(selectedEOSAssetList.toJS().map((selectedEOSAsset: { contract: string }) => call(eos.getCurrencyBalance, { code: selectedEOSAsset.contract, account: eosAccountName })))

    // const balanceInfo = data.map((item: any, index: number) => {
    //   const blockchain = 'EOS'
    //   const contract = selectedEOSAssetList.getIn([index, 'contract'])
    //   const symbol = selectedEOSAssetList.getIn([index, 'symbol'])
    //   let balance = '0.0000'
    //   if (item && item[0] && typeof item[0] === 'string') {
    //     const index = item.findIndex((v: string) => v.indexOf(symbol) !== -1)

    //     if (index !== -1) {
    //       balance = item[index].split(' ')[0]
    //     }
    //   }
    //   return { symbol, balance, contract, blockchain }
    // })

    // yield put(actions.getEOSAssetBalanceListSucceeded({ eosAccountName, balanceInfo }))
  } catch (e) {
    yield put(actions.getEOSAssetBalanceListFailed(getErrorMessage(e)))
  }
}

export default function* balanceSaga() {
  yield takeEvery(String(actions.getEOSBalanceRequested), getEOSBalanceRequested)
  yield takeEvery(String(actions.getEOSAssetBalanceRequested), getEOSAssetBalanceRequested)
  yield takeEvery(String(actions.getEOSAssetBalanceListRequested), getEOSAssetBalanceListRequested)
}
