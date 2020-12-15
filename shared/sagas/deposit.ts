import assert from 'assert'
import {polkaApi} from 'core/chain/polkadot'
import {activeWalletSelector} from 'selectors/wallet'
import {activeDepositSelector} from 'selectors/deposit'
import * as actions from '../actions/deposit'
import * as chain from 'core/chain/polkadot'
import * as wallet from 'core/wallet'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { publicKeyToAddress } from 'core/utils'
import {getDepositAddressAssetId} from 'utils/riochain'
// @ts-ignore
import secureStorage from 'core/storage/secureStorage'

function* getBitcoinDepositAddressOnChain(action) {
  const activeWallet = yield select(activeWalletSelector)
  // @ts-ignore
  const { id } = activeWallet || {}
  try {
    const api = yield call(polkaApi)
    const res1 = yield call(api.query.rioGateway.depositAddrInfoOfAssetId, 100)
    const bip32Info = JSON.parse(String(res1))
    const xpub = bip32Info[0]
    const path = bip32Info[1]
    const idOnChain = activeWallet && activeWallet.idOnChain
    assert(typeof(idOnChain) === 'number', 'no id on chain')
    const publicKey = yield call(chain.deriveHdAddress, xpub, path, idOnChain)
    const btcAddress = yield call(publicKeyToAddress, publicKey, 'bitcoin', { isSegWit: true })
    // @ts-ignore
    yield put(actions.updateBitcoinDepositAddress({ id, address: btcAddress }))
    // @ts-ignore
    yield put(actions.updateDepositAddress({ id, address: btcAddress, chainType: 'bitcoin' }))
    yield put(actions.getBitcoinDepositAddressOnChain.succeeded())
  } catch (error) {
    // @ts-ignore
    yield put(actions.getBitcoinDepositAddressOnChain.failed(error.message))
  }
}

function* getDepositAddressOnChain(action) {
  if (!action.payload) return

  try {
    const { id, assetId, chainType,symbol } = action.payload
    const api = yield call(polkaApi)
    const depositeAssetId = getDepositAddressAssetId(assetId)
    const res1 = yield call(api.query.rioGateway.depositAddrInfoOfAssetId, depositeAssetId)
    const depositAddrInfo = JSON.parse(String(res1))
    const depositInfo = yield select(activeDepositSelector)
    const idOnChain = depositInfo && depositInfo.idOnChain
    assert(typeof(idOnChain) === 'number', 'no id on chain')

    let address
    if (depositAddrInfo.Bip32) {
      const xpub = depositAddrInfo.Bip32.x_pub
      const path = depositAddrInfo.Bip32.path
      console.log('xpub', xpub)
      const publicKey = yield call(chain.deriveHdAddress, xpub, path, idOnChain, true)
      address = yield call(publicKeyToAddress, publicKey, chainType, { isSegWit: true, isTestNet: true, isP2SH: true })
    } else {
      const creatorAddress = depositAddrInfo.Create2.creator_address
      const implementationAddress = depositAddrInfo.Create2.implementation_address
      const vaultAddress = depositAddrInfo.Create2.vault_address
      address = yield call(chain.deriveCreate2Address, creatorAddress, implementationAddress, vaultAddress, idOnChain)
    }

    // @ts-ignore
    yield put(actions.updateDepositAddress({ id, address, symbol }))
    yield put(actions.getDepositAddressOnChain.succeeded())
  } catch (error) {
    // @ts-ignore
    yield put(actions.getDepositAddressOnChain.failed(error.message))
  }
}


function* applyIdOnChain(action) {
  if(!action.payload) return
  const { id, address, password,chainType,assetId,source,symbol, onError } = action.payload
  try {

    let keystore
    // tslint:disable-next-line:prefer-conditional-expression
    if (source === 'NEW_IDENTITY' || source === 'RECOVERED_IDENTITY') {
      keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    } else {
      keystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    }
    assert(keystore , 'No keystore')

    const sender = yield call(wallet.exportRioChainKeyPair, password, keystore)

    yield call(chain.applyDepositAddress, sender)
    const api = yield call(polkaApi)
    // yield delay(2000)
    const result = yield call(api.query.rioGateway.depoistIndexOfAccountId, address)
    assert(!!String(result).length, 'no path index yet')
    const idOnChain = Number(result)
    // @ts-ignore
    yield put(actions.updateIdOnChain({ id, idOnChain }))
    yield put(actions.applyIdOnChain.succeeded())
    // @ts-ignore
    yield put(actions.getDepositAddressOnChain.requested({ id, address, assetId, symbol ,chainType}))
  } catch (error) {
    // @ts-ignore
    yield put(actions.applyIdOnChain.failed(error.message))
    if (onError) onError(error.message)
  }
}

function* getIdOnChain(action) {
  if(!action.payload) return
  const { id, address,assetId,chainType, symbol, onError } = action.payload
  try {

    const api = yield call(polkaApi)
    // yield delay(2000)
    const result = yield call(api.query.rioGateway.depoistIndexOfAccountId, address)
    console.log('applyIdOnChain  result :',result)
    assert(!!String(result).length, 'no path index yet')
    const idOnChain = Number(result)
    // @ts-ignore
    yield put(actions.updateIdOnChain({ id, idOnChain }))
    yield put(actions.applyIdOnChain.succeeded())
    // @ts-ignore
    yield put(actions.getDepositAddressOnChain.requested({ id, address, assetId, symbol,chainType }))
  } catch (error) {
    // @ts-ignore
    yield put(actions.applyIdOnChain.failed(error.message))
    if (onError) onError(error.message)
  }
}




export default function* depositSaga() {
  yield takeLatest(String(actions.getBitcoinDepositAddressOnChain.requested), getBitcoinDepositAddressOnChain)
  yield takeLatest(String(actions.getDepositAddressOnChain.requested), getDepositAddressOnChain)
  yield takeLatest(String(actions.applyIdOnChain.requested), applyIdOnChain)
  yield takeLatest(String(actions.getIdOnChain.requested), getIdOnChain)
}
