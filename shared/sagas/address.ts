import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import * as actions from 'actions/address'
import { getUTXO } from 'actions/utxo'
import * as btcChain from 'core/chain/bitcoin'
import secureStorage from 'core/storage/secureStorage'
import { segWit } from 'core/constants'

function* scanHDAddresses(action: Action) {
  if (!action.payload) return

  try {
    const walletId = action.payload.id
    const address = action.payload.address
    const chain = action.payload.chain
    const symbol = action.payload.symbol
    const precision = action.payload.precision
    const id = `${chain}/${address}`
    const keystore = (yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${walletId}`, true)) || (yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${walletId}`, true))
    assert(keystore && keystore.crypto, 'No keystore')
    const xpub = keystore.xpub
    const isSegWit = keystore.bitportalMeta.segWit && keystore.bitportalMeta.segWit !== segWit.none
    const addresses = yield call(btcChain.scanHDAddressesByXpub, xpub, 0, 99, isSegWit)

    const externalAddresses = addresses.filter((address: string) => address.change === '0')
    const changeAddresses = addresses.filter((address: string) => address.change === '1')
    const externalAddressesNormalized = {
      byId: {},
      allIds: []
    }
    externalAddresses.forEach((address: string) => {
      const id = address.address
      externalAddressesNormalized.byId[id] = address
      externalAddressesNormalized.allIds.push(id)
    })
    const changeAddressesNormalized = {
      byId: {},
      allIds: []
    }
    changeAddresses.forEach((address: string) => {
      const id = address.address
      changeAddressesNormalized.byId[id] = address
      changeAddressesNormalized.allIds.push(id)
    })

    yield put(actions.updateAddress({
      addresses: {
        external: externalAddressesNormalized,
        change: changeAddressesNormalized
      },
      id
    }))

    const hdAddresses = addresses.map((address: string) => address.address)
    yield put(actions.scanHDAddresses.succeeded({ walletId, id, chain, symbol, precision, addresses: hdAddresses }))
  } catch (e) {
    yield put(actions.scanHDAddresses.failed(getErrorMessage(e)))
  }
}

function* scanHDAddressesSucceeded(action: Action) {
  if (!action.payload) return

  yield put(getUTXO.requested(action.payload))
}

export default function* addressSaga() {
  yield takeLatest(String(actions.scanHDAddresses.requested), scanHDAddresses)
  yield takeLatest(String(actions.scanHDAddresses.succeeded), scanHDAddressesSucceeded)
}
