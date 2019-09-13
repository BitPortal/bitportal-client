import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, put, call, select, all } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import { eosAssetAllIdsSelector, assetByIdSelector, selectedAssetIdsSelector } from 'selectors/asset'
import * as actions from 'actions/asset'
import { updateBalanceList } from 'actions/balance'
import * as api from 'utils/api'

function* getETHAsset(action: Action) {
  try {
    const result = yield call(api.getETHAsset, action.payload)
    // console.log('getETHAsset', result)
    yield put(actions.updateAsset({ assets: result, chain: 'ETHEREUM' }))
    yield put(actions.getETHAsset.succeeded())
  } catch (e) {
    yield put(actions.getETHAsset.failed(getErrorMessage(e)))
  }
}

function* getEOSAsset(action: Action) {
  try {
    const result = yield call(api.getEOSAsset, action.payload)
    const eosAssets = result.data.map(item => ({ ...item, chain: 'EOS', icon_url: item.logo, icon_url_lg: item.logoLg, contract: item.contract, id: `${item.contract}/${item.symbol}` })).filter(item => !(item.contract === 'eosio.token' && item.symbol === 'EOS'))
    yield put(actions.updateAsset({ assets: eosAssets, chain: 'EOS' }))
    yield put(actions.getEOSAsset.succeeded())
  } catch (e) {
    yield put(actions.getEOSAsset.failed(getErrorMessage(e)))
  }
}

function* getChainXAsset(action: Action) {
  try {
    const chainxAssets = [{
      id: 'CHAINX/X-BTC',
      name: 'X-BTC',
      chain: 'CHAINX',
      symbol: 'BTC',
      contract: 'XAssets',
      precision: 8,
      icon_url: 'https://cdn.bitportal.io/tokenicon/32/color/btc.png'
    }, {
      id: 'CHAINX/SDOT',
      name: 'Shadow DOT',
      chain: 'CHAINX',
      symbol: 'SDOT',
      contract: 'XAssets',
      precision: 3,
      icon_url: 'https://cdn.bitportal.io/icons/dot.png'
    }, {
      id: 'CHAINX/L-BTC',
      name: 'Lock-up BTC',
      chain: 'CHAINX',
      symbol: 'L-BTC',
      contract: 'XAssets',
      precision: 8,
      icon_url: 'https://cdn.bitportal.io/icons/chainx_lbtc.png'
    }]
    yield put(actions.updateAsset({ assets: chainxAssets, chain: 'CHAINX' }))
    yield put(actions.getChainXAsset.succeeded())
  } catch (e) {
    yield put(actions.getChainXAsset.failed(getErrorMessage(e)))
  }
}

function* scanEOSAsset(action: Action) {
  try {
    const eosAssetsAllIds = yield select(state => eosAssetAllIdsSelector(state))
    const activeWallet = action.payload

    if (eosAssetsAllIds.length) {
      const result = yield call(api.scanEOSAsset, activeWallet)
      const assetById = yield select(state => assetByIdSelector(state))
      const balances = result.balances.map(balance => ({ chain: 'EOS', balance: balance.amount, contract: balance.contract, symbol: balance.currency, precision: balance.decimals })).filter(item => !(item.contract === 'eosio.token' && item.symbol === 'EOS'))
      yield put(updateBalanceList({ id: `EOS/${activeWallet.address}`, chain: activeWallet.chain, balanceList: balances }))

      const selectedAssetIds = yield select(state => selectedAssetIdsSelector(state))
      if (!selectedAssetIds || !selectedAssetIds.length) {
        const assets = balances.map(balance => `EOS/${balance.contract}/${balance.symbol}`).map(id => assetById[id]).filter(item => !!item).map(item => ({ walletId: `${activeWallet.id}`, assetId: `EOS/${item.contract}/${item.symbol}` }))
        yield put(actions.selectAssetList(assets))
      }
    } else {
      const [assetResult, balanceResult] = yield all([
        call(api.getEOSAsset, activeWallet),
        call(api.scanEOSAsset, activeWallet)
      ])

      const eosAssets = assetResult.data.map(item => ({ ...item, chain: 'EOS', icon_url: item.logo, icon_url_lg: item.logoLg, contract: item.contract, id: `${item.contract}/${item.symbol}` })).filter(item => !(item.contract === 'eosio.token' && item.symbol === 'EOS'))
      yield put(actions.updateAsset({ assets: eosAssets, chain: 'EOS' }))

      const assetById = yield select(state => assetByIdSelector(state))
      const balances = balanceResult.balances.map(balance => ({ chain: 'EOS', balance: balance.amount, contract: balance.contract, symbol: balance.currency, precision: balance.decimals })).filter(item => !(item.contract === 'eosio.token' && item.symbol === 'EOS'))
      yield put(updateBalanceList({ id: `EOS/${activeWallet.address}`, chain: activeWallet.chain, balanceList: balances }))
      const selectedAssetIds = yield select(state => selectedAssetIdsSelector(state))
      if (!selectedAssetIds || !selectedAssetIds.length) {
        const assets = balances.map(balance => `EOS/${balance.contract}/${balance.symbol}`).map(id => assetById[id]).filter(item => !!item).map(item => ({ walletId: `${activeWallet.id}`, assetId: `EOS/${item.contract}/${item.symbol}` }))
        yield put(actions.selectAssetList(assets))
      }
    }

    yield put(actions.scanEOSAsset.succeeded())
  } catch (e) {
    yield put(actions.scanEOSAsset.failed(getErrorMessage(e)))
  }
}

function* handleAssetSearchTextChange(action: Action) {
  yield delay(200)
  const text = action.payload.text || ''
  yield put(actions.setAssetSearchText(text))

  const chain = action.payload.chain

  if (chain === 'ETHEREUM' && !!text) {
    yield put(actions.getETHAsset.requested({ name_contains: text }))
  }
}

export default function* assetSaga() {
  yield takeLatest(String(actions.getETHAsset.requested), getETHAsset)
  yield takeLatest(String(actions.getEOSAsset.requested), getEOSAsset)
  yield takeLatest(String(actions.getChainXAsset.requested), getChainXAsset)
  yield takeLatest(String(actions.scanEOSAsset.requested), scanEOSAsset)
  yield takeLatest(String(actions.handleAssetSearchTextChange), handleAssetSearchTextChange)
}
