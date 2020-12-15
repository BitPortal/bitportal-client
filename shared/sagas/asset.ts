import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, put, call, select, all } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import { eosAssetAllIdsSelector, assetByIdSelector, selectedAssetIdsSelector } from 'selectors/asset'
import {activeWalletSelector} from 'selectors/wallet'
import * as actions from 'actions/asset'
import { updateBalanceList } from 'actions/balance'
import * as api from 'utils/api'
import{ chain} from 'core/constants'
import {polkaApi} from 'core/chain/polkadot'
import { getAssetUniqueInfo } from 'utils/riochain'

function* getETHAsset(action: Action) {
  try {
    const { display_priority_gt } = action.payload
    const defaultAssets = yield call(api.getETHAsset, {display_priority_gt})
    const handleUrl = (url='') => (url || '').replace('etherscan.io','cn.etherscan.com')
    const assets = defaultAssets.map(item => ({...item,icon_url: handleUrl(item.icon_url)}))
    yield put(actions.updateAsset({ assets, chain: 'ETHEREUM' }))
    yield put(actions.getETHAsset.succeeded())
  } catch (e) {
    yield put(actions.getETHAsset.failed(getErrorMessage(e)))
  }
}

function* getRioChainAsset_TEST(action: Action) {

  try {
    const rioWallet = yield select(state => activeWalletSelector(state))
   const defaultAssets = {
      id: 0,
      symbol:'RFUEL',
      chain: 'Rio',
      name: 'RIO token',
      decimals: 12,
      contract: 0,
      desc: 'RIO chain token',
      address: rioWallet && rioWallet.address || ''
    }
    yield put(actions.updateAsset({ assets: defaultAssets, chain: chain.polkadot }))
    yield put(actions.getRioChainAsset.succeeded())
  }catch (e) {
    yield put(actions.getRioChainAsset.failed(getErrorMessage(e)))
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

function* getRioChainAsset(action: Action) {
  try {
    // const riochainAssets = [{
    //   id: 'RIOCHAIN/RFuel',
    //   name: 'RFuel',
    //   chain:  chain.polkadot,
    //   symbol: 'RFuel',
    //   contract: 'currencies',
    //   currency_id: 0,
    //   precision: 12,
    //   icon_url: ''
    // }, {
    //   id: 'RIOCHAIN/rBTC',
    //   name: 'rBTC',
    //   chain:  chain.polkadot,
    //   symbol: 'rBTC',
    //   contract: 'currencies',
    //   currency_id: 100,
    //   precision: 8,
    //   icon_url: ''
    // }, {
    //   id: 'RIOCHAIN/rETH',
    //   name: 'rETH',
    //   chain:  chain.polkadot,
    //   symbol: 'rETH',
    //   contract: 'currencies',
    //   currency_id: 103,
    //   precision: 18,
    //   icon_url: ''
    // }, {
    //   id: 'RIOCHAIN/rUSDT',
    //   name: 'rUSDT',
    //   chain:  chain.polkadot,
    //   symbol: 'rUSDT',
    //   contract: 'currencies',
    //   currency_id: 102,
    //   precision: 6,
    //   icon_url: ''
    // }]

    // const riochainTokens = [
    //   { symbol: 'RFUEL', assetId: 0 },
    //   { symbol: 'OM', assetId: 2 },
    //   { symbol: 'rBTC', assetId: 100 },
    //   { symbol: 'rUSDT', assetId: 102 },
    //   { symbol: 'rETH', assetId: 103 }
    // ];

    const rioWallet = action.payload
    const handleAssetInfo = (assetInfo,contract) => {
      assert(String(assetInfo.value), 'no asset info')
      const info = JSON.parse(String(assetInfo.value))
      info.address = rioWallet && rioWallet.address || ''
      if (contract) {
        info.contract =  contract
      }
      return info
    }

    const api = yield call(polkaApi)
    const rOMAssetInfo = yield api.query.rioAssets.assetInfos(2)
    const rBTCAssetInfo = yield api.query.rioAssets.assetInfos(100)
    const rUSDTAssetInfo = yield api.query.rioAssets.assetInfos(102)
    const rETHAssetInfo = yield api.query.rioAssets.assetInfos(103)
    const rOMInfo = handleAssetInfo(rOMAssetInfo,2)
    const rBTCInfo = handleAssetInfo(rBTCAssetInfo,100)
    const rUSDTInfo = handleAssetInfo(rUSDTAssetInfo,102)
    const rETHInfo = handleAssetInfo(rETHAssetInfo,103)

    const riochainAssets = []
    // riochainAssets.push({
    //   id: 0,
    //   symbol:'RFUEL',
    //   chain: 'Rio',
    //   name: 'RIO token',
    //   decimals: 12,
    //   desc: 'RIO chain token',
    //   address: rioWallet && rioWallet.address || ''
    // })
    rOMInfo && riochainAssets.push(rOMInfo)
    rBTCInfo && riochainAssets.push(rBTCInfo)
    rUSDTInfo && riochainAssets.push(rUSDTInfo)
    rETHInfo && riochainAssets.push(rETHInfo)

    const newAssets = []
    const selectedAssets = riochainAssets.map(item => {
      const assetInfo = getAssetUniqueInfo(rioWallet, item)
      newAssets.push(assetInfo)
      const contract = assetInfo.contract || assetInfo.address
      return {
        walletId: `${rioWallet.id}`,
        assetId:  `${chain.polkadot}/${contract}/${assetInfo.symbol}`
      }
    })

    yield put(actions.updateAsset({ assets: newAssets, chain: chain.polkadot }))
    yield put(actions.selectAssetList(selectedAssets))
    yield put(actions.getRioChainAsset.succeeded())
  } catch (e) {
    yield put(actions.getRioChainAsset.failed(getErrorMessage(e)))
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

function* scanETHAsset(action: Action) {
  try {
    const activeWallet = action.payload
    const result = yield call(api.scanETHAsset, activeWallet)
    // const result = yield call(api.scanETHAsset, {address: '0x47F7EA0dd4418AA1cec00786F5C47623aC37bA42'})

    assert(result && result.tokens && typeof result.tokens === 'object', 'no tokens')

    // todo remove symbol is undefine
    const newTokens = result.tokens.filter((item:any) => item.tokenInfo && item.tokenInfo.symbol && item.tokenInfo.symbol.length)

    const handleUrl = (url='') => (url || '').replace('etherscan.io','cn.etherscan.com')
    const assets = newTokens.map(item => ({
      address: item.tokenInfo.address,
      contract: item.tokenInfo.address,
      decimals: +item.tokenInfo.decimals,
      symbol: item.tokenInfo.symbol,
      name: item.tokenInfo.name,
      chain: 'ETHEREUM',
      icon_url: item.tokenInfo.image ? `http://ethplorer.io${item.tokenInfo.image}` : ''
    }))
  // handleUrl(item.tokenInfo.image ? item.tokenInfo.image : '')
    yield put(actions.updateAsset({ assets, chain: 'ETHEREUM' }))

    const selectedAssets = assets.map(item => ({ walletId: `${activeWallet.id}`, assetId: `ETHEREUM/${item.contract}/${item.symbol}` }))
    yield put(actions.selectAssetList(selectedAssets))

    const balances = newTokens.map(item => ({
      contract: item.tokenInfo.address,
      decimals: +item.tokenInfo.decimals,
      precision: 8,
      symbol: item.tokenInfo.symbol,
      chain: 'ETHEREUM',
      balance: (+item.balance) * Math.pow(10, -item.tokenInfo.decimals)
    }))
    yield put(updateBalanceList({ id: `ETHEREUM/${activeWallet.address}`, chain: activeWallet.chain, balanceList: balances }))

    yield put(actions.scanETHAsset.succeeded())
  } catch (e) {
    yield put(actions.scanETHAsset.failed(getErrorMessage(e)))
  }
}

function* handleAssetSearchTextChange(action: Action) {
  yield delay(200)
  const text = action.payload.text || ''
  yield put(actions.setAssetSearchText(text))

  const chain = action.payload.chain

  if (chain === 'ETHEREUM' && !!text) {
    yield put(actions.getETHAsset.requested({ name_contains: text, symbol_contains: text }))
  }
}

export default function* assetSaga() {
  yield takeLatest(String(actions.getETHAsset.requested), getETHAsset)
  yield takeLatest(String(actions.getRioChainAsset.requested), getRioChainAsset)
  yield takeLatest(String(actions.getEOSAsset.requested), getEOSAsset)
  yield takeLatest(String(actions.getChainXAsset.requested), getChainXAsset)
  yield takeLatest(String(actions.scanEOSAsset.requested), scanEOSAsset)
  yield takeLatest(String(actions.scanETHAsset.requested), scanETHAsset)
  yield takeLatest(String(actions.handleAssetSearchTextChange), handleAssetSearchTextChange)
}
