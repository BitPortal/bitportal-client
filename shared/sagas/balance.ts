import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import { updatePortfolio } from 'actions/portfolio'
import * as actions from 'actions/balance'
import { tickerByIdSelector } from 'selectors/ticker'
import { walletByIdSelector } from 'selectors/wallet'
import { getAccount } from 'actions/account'
import { scanHDAddresses } from 'actions/address'
import { getUTXO } from 'actions/utxo'
import * as btcChain from 'core/chain/bitcoin'
import * as ethChain from 'core/chain/etheruem'
import * as eosChain from 'core/chain/eos'
import * as chainxChain from 'core/chain/chainx'

function* getBalance(action: Action) {
  if (!action.payload) return

  try {
    const chain = action.payload.chain
    const address = action.payload.address
    const symbol = action.payload.symbol
    const source = action.payload.source
    const walletId = action.payload.id

    let balance = '0'
    let id = `${chain}/${address}`

    if (chain === 'BITCOIN') {
      if (source === 'WIF') {
        yield put(getUTXO.requested({ addresses: [address], walletId, id, chain, symbol, precision: 8 }))
      } else {
        const allAddresses = yield select((state: RootState) => state.address)
        const walletAddresses = allAddresses.byId[id]
        if (walletAddresses) {
          const addresses = walletAddresses.external.allIds.concat(walletAddresses.change.allIds)
          yield put(getUTXO.requested({ addresses, walletId, id, chain, symbol, precision: 8 }))
        } else {
          yield put(scanHDAddresses.requested({ ...action.payload, precision: 8 }))
        }
      }
    } else if (chain === 'ETHEREUM') {
      balance = yield call(ethChain.getBalance, address)
      yield put(actions.updateBalance({ id, chain, balance, symbol, precision: 8 }))
      yield put(actions.getBalance.succeeded({ walletId, balance }))
    } else if (chain === 'EOS') {
      const result = yield call(eosChain.getBalance, address)
      balance = result.balance
      const { symbol, precision, contract } = result
      yield put(actions.updateBalance({ id, chain, balance, symbol, precision }))
      yield put(actions.getBalance.succeeded({ walletId, balance }))
    } else if (chain === 'CHAINX') {
      // balance = yield call(chainxChain.getBalance, address)
      // yield put(actions.updateBalance({ id, chain, balance, symbol, precision: 8 }))
      // yield put(actions.getBalance.succeeded({ walletId, balance }))
    }
  } catch (e) {
    yield put(actions.getBalance.failed(getErrorMessage(e)))
  }
}

function* getETHTokenBalance(action: Action) {
  if (!action.payload) return

  try {
    const chain = action.payload.chain
    const address = action.payload.address
    const symbol = action.payload.symbol
    const contract = action.payload.contract
    const source = action.payload.source
    const walletId = action.payload.id

    let balance = '0'
    let id = `${chain}/${address}/${contract}/${symbol}`

    balance = yield call(ethChain.getTokenBalance, address)
    yield put(actions.updateBalance({ id, chain, balance, symbol, precision: 8 }))
    yield put(actions.getETHTokenBalance.succeeded({ walletId, balance }))
  } catch (e) {
    yield put(actions.getETHTokenBalance.failed(getErrorMessage(e)))
  }
}

function* getEOSTokenBalance(action: Action) {
  if (!action.payload) return

  try {
    console.log(action.payload)
    const chain = action.payload.chain
    const address = action.payload.address
    const symbol = action.payload.symbol
    const contract = action.payload.contract
    const walletId = action.payload.id

    let balance = '0'
    let id = `${chain}/${address}`

    const result = yield call(eosChain.getBalance, address, contract, symbol)
    balance = result.balance
    yield put(actions.updateBalance({ id, chain, balance: balance, symbol: result.symbol, precision: result.precision, contract }))
    yield put(actions.getEOSTokenBalance.succeeded({ walletId, balance }))
  } catch (e) {
    yield put(actions.getEOSTokenBalance.failed(getErrorMessage(e)))
  }
}

function* getBalanceSucceeded(action: Action) {
  if (!action.payload) return

  let totalAsset = 0
  const walletId = action.payload.walletId
  const walletById = yield select((state: RootState) => walletByIdSelector(state))
  const wallet = walletById && walletId && walletById[walletId]

  if (wallet) {
    const ticker = yield select((state: RootState) => tickerByIdSelector(state))
    const price = ticker && ticker[`${wallet.chain}/${wallet.symbol}`] && ticker[`${wallet.chain}/${wallet.symbol}`].price_usd
    const balance = action.payload.balance

    totalAsset = (balance && price) ? +price * +balance : 0
    yield put(updatePortfolio({ id: `${wallet.chain}/${wallet.address}`, totalAsset }))

    if (wallet.chain === 'EOS') yield put(getAccount.requested(wallet))
  }
}

export default function* balanceSaga() {
  yield takeLatest(String(actions.getBalance.requested), getBalance)
  yield takeLatest(String(actions.getBalance.refresh), getBalance)
  yield takeLatest(String(actions.getBalance.succeeded), getBalanceSucceeded)
  yield takeLatest(String(actions.getETHTokenBalance.requested), getETHTokenBalance)
  yield takeLatest(String(actions.getEOSTokenBalance.requested), getEOSTokenBalance)
}
