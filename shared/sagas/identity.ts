import assert from 'assert'
import { delay } from 'redux-saga'
import { takeEvery, takeLatest, put, call, select } from 'redux-saga/effects'
import { reset } from 'redux-form'
import { getErrorMessage } from 'utils'
import * as identityActions from 'actions/identity'
import * as walletActions from 'actions/wallet'
import * as walletCore from 'core/wallet'
import memoryStorage from 'core/storage/memoryStorage'
import secureStorage from 'core/storage/secureStorage'
import { importedWalletSelector, activeWalletIdSelector, bridgeWalletIdSelector } from 'selectors/wallet'
import { push, dismissAllModals, showModal, popToRoot } from 'utils/location'
import { CHAIN_ORDER } from 'constants/chain'

const actions = { ...identityActions, ...walletActions }

function* scanIdentity(action: Action<ScanIdentityParams>) {
  try {
    yield call(secureStorage.removeAllItems)
    const allItems = yield call(secureStorage.getAllItems)
    assert(!(Object.keys(allItems).length === 0 && allItems.constructor === Object), 'No keystores')

    const activeWalletId = yield select((state: RootState) => state.wallet.activeWalletId)

    const identityKeystore = Object.keys(allItems).filter(item => !item.indexOf('IDENTITY_KEYSTORE')).map((item) => {
      const info = allItems[item]
      return JSON.parse(info)
    })[0]

    if (identityKeystore) {
      const identityInfo = walletCore.getIdentityMetaData(identityKeystore)

      const walletIDs = identityInfo.walletIDs
      const identityWallets = Object.keys(allItems).filter(item => !item.indexOf('IDENTITY_WALLET_KEYSTORE')).map((item) => {
        const info = allItems[item]
        return JSON.parse(info)
      }).filter(wallet => walletIDs.indexOf(wallet.id) !== -1).sort((a, b) => {
        if (a.bitportalMeta.chain && b.bitportalMeta.chain) {
          return CHAIN_ORDER[a.bitportalMeta.chain] - CHAIN_ORDER[b.bitportalMeta.chain]
        }

        return a.bitportalMeta.timestamp - b.bitportalMeta.timestamp
      })

      const identityWalletsInfo = identityWallets.map(walletCore.getWalletMetaData)

      yield put(actions.mergeIdentity(identityInfo))
      yield put(actions.mergeIdentityWallets(identityWalletsInfo))
      if (!activeWalletId) yield put(actions.setActiveWallet(identityWalletsInfo[0].id))
    }

    const importedWallets = Object.keys(allItems).filter(item => !item.indexOf('IMPORTED_WALLET_KEYSTORE')).map((item) => {
      const info = allItems[item]
      return JSON.parse(info)
    }).sort((a, b) => a.bitportalMeta.timestamp - b.bitportalMeta.timestamp)

    const importedWalletsInfo = importedWallets.map(walletCore.getWalletMetaData)

    yield put(actions.mergeImportedWallets(importedWalletsInfo))

    if (!identityKeystore && !activeWalletId) yield put(actions.setActiveWallet(importedWalletsInfo[0].id))

    yield put(actions.scanIdentity.succeeded())
  } catch (e) {
    yield put(actions.scanIdentity.failed(getErrorMessage(e)))
  }
}

function* createIdentity(action: Action<CreateIdentityParams>) {
  if (!action.payload) return

  try {
    const name = action.payload.name
    const password = action.payload.password
    const passwordHint = action.payload.passwordHint || ''
    const identity = yield call(walletCore.createIdentity, password, name, passwordHint, 'MAINNET', true)
    const mnemonics = yield call(walletCore.exportMnemonic, password, identity.keystore)
    yield call(memoryStorage.setItem, 'identity', identity, true)
    yield put(reset('createIdentityForm'))
    yield put(actions.createIdentity.succeeded(mnemonics))
  } catch (e) {
    yield put(actions.createIdentity.failed(getErrorMessage(e)))
  }
}

function* validateMnemonics(action: Action<ValidateMnemonicsResult>) {
  try {
    const identity = yield call(memoryStorage.getItem, 'identity', true)
    
    if (identity && identity.keystore) {      
      const identityKeystore = identity.keystore
      yield call(secureStorage.setItem, `IDENTITY_KEYSTORE_${identityKeystore.id}`, identityKeystore, true)
      const identityWallets = identity.wallets
      for (const wallet of identityWallets) {
        yield call(secureStorage.setItem, `IDENTITY_WALLET_KEYSTORE_${wallet.id}`, wallet, true)
      }

      const identityInfo = walletCore.getIdentityMetaData(identityKeystore)
      const walletsInfo = identityWallets.map(walletCore.getWalletMetaData)

      yield put(actions.addIdentity(identityInfo))
      yield put(actions.addIdentityWallets(walletsInfo))
      yield put(actions.setActiveWallet(walletsInfo[0].id))
      yield call(memoryStorage.removeItem, 'identity')
    }

    yield put(actions.validateMnemonics.succeeded())
  } catch (e) {
    yield put(actions.validateMnemonics.failed(getErrorMessage(e)))
  }
}

function* recoverIdentity(action: Action<RecoverIdentityParams>) {
  if (!action.payload) return

  try {
    const name = 'my_identity'
    const password = action.payload.password
    const passwordHint = action.payload.passwordHint || ''
    const mnemonics = action.payload.mnemonics
    const identity = yield call(walletCore.recoverIdentity, mnemonics, password, name, passwordHint, 'MAINNET', true)

    const identityKeystore = identity.keystore
    yield call(secureStorage.setItem, `IDENTITY_KEYSTORE_${identityKeystore.id}`, identityKeystore, true)
    const identityWallets = identity.wallets
    for (const wallet of identityWallets) {
      yield call(secureStorage.setItem, `IDENTITY_WALLET_KEYSTORE_${wallet.id}`, wallet, true)
    }

    const identityInfo = walletCore.getIdentityMetaData(identityKeystore)
    const walletsInfo = identityWallets.map(walletCore.getWalletMetaData)

    yield put(actions.addIdentity(identityInfo))
    yield put(actions.addIdentityWallets(walletsInfo))
    yield put(actions.setActiveWallet(walletsInfo[0].id))
    yield put(actions.recoverIdentity.succeeded())
  } catch (e) {
    yield put(actions.recoverIdentity.failed(getErrorMessage(e)))
  }
}

function* backupIdentity(action: Action<BackupIdentityParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const id = action.payload.id
    const password = action.payload.password

    const keystore = yield call(secureStorage.getItem, `IDENTITY_KEYSTORE_${id}`, true)

    assert(keystore && keystore.crypto, 'No keystore')
    const mnemonics = yield call(walletCore.exportMnemonic, password, keystore)
    yield put(actions.backupIdentity.succeeded())

    yield delay(500)
    if (action.payload.componentId) {
      showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.BackupIdentity',
              passProps: { mnemonics, backup: true, fromIdentity: true },
              options: {
                topBar: {
                  leftButtons: [
                    {
                      id: 'cancel',
                      text: '取消'
                    }
                  ]
                }
              }
            }
          }]
        }
      })
    }
  } catch (e) {
    yield put(actions.backupIdentity.failed(getErrorMessage(e)))
  }
}

function* deleteIdentity(action: Action<LogoutIdentityParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const id = action.payload.id
    const password = action.payload.password
    const keystore = yield call(secureStorage.getItem, `IDENTITY_KEYSTORE_${id}`, true)
    assert(keystore && keystore.crypto && keystore.walletIDs, 'No keystore')

    const isValidPassword = yield call(walletCore.verifyPassword, password, keystore.crypto)
    assert(isValidPassword, 'Invalid password')

    yield call(secureStorage.removeItem, `IDENTITY_KEYSTORE_${id}`)
    yield put(actions.removeIdentity(id))

    const walletIDs = keystore.walletIDs
    for (const id of walletIDs) {
      yield call(secureStorage.removeItem, `IDENTITY_WALLET_KEYSTORE_${id}`)
      yield put(actions.removeIdentityWallet(id))
      // yield put(transactionActions.removeTransactions({ id: `${chain}/${address}` }))
    }

    yield put(actions.deleteIdentity.succeeded())

    const activeWalletId = yield select((state: RootState) => activeWalletIdSelector(state))

    if (walletIDs.indexOf(activeWalletId) !== -1) {
      const importedWallets = yield select((state: RootState) => importedWalletSelector(state))

      if (importedWallets && importedWallets.length) {
        yield put(actions.setActiveWallet(importedWallets[0].id))
      }
    }

    const bridgeWalletId = yield select((state: RootState) => bridgeWalletIdSelector(state))

    if (walletIDs.indexOf(bridgeWalletId) !== -1) {
      yield put(walletActions.setBridgeWallet(null))
      yield put(walletActions.setBridgeChain(null))
    }

    if (action.payload.componentId) {
      if (action.payload.fromModal) {
        dismissAllModals()
      } else {
        popToRoot(action.payload.componentId)
      }
    }
  } catch (e) {
    yield put(actions.deleteIdentity.failed(getErrorMessage(e)))
  }
}

export default function* identitySaga() {
  yield takeEvery(String(actions.scanIdentity.requested), scanIdentity)
  yield takeLatest(String(actions.createIdentity.requested), createIdentity)
  yield takeLatest(String(actions.recoverIdentity.requested), recoverIdentity)
  yield takeLatest(String(actions.backupIdentity.requested), backupIdentity)
  yield takeLatest(String(actions.deleteIdentity.requested), deleteIdentity)
  yield takeLatest(String(actions.validateMnemonics.requested), validateMnemonics)
}
