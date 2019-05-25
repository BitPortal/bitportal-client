import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, takeEvery, put, call, select } from 'redux-saga/effects'
import { reset } from 'redux-form'
import { getErrorMessage, getEOSErrorMessage } from 'utils'
import * as actions from 'actions/wallet'
import * as transactionActions from 'actions/transaction'
import { getBalance } from 'actions/balance'
import {
  walletAddressesSelector,
  identityWalletSelector,
  importedWalletSelector,
  activeWalletSelector,
  walletAllIdsSelector
} from 'selectors/wallet'
import * as walletCore from 'core/wallet'
import { createHDBTCKeystore, createBTCKeystore } from 'core/keystore'
import {
  getEOSKeyAccountsByPrivateKey,
  getEOSPermissionKeyPairs
} from 'core/chain/eos'
import memoryStorage from 'core/storage/memoryStorage'
import secureStorage from 'core/storage/secureStorage'
import { push, dismissAllModals, popToRoot, showModal } from 'utils/location'

function* setActiveWallet(action: Action<SetActiveWalletParams>) {
  if (!action.payload) return

  const activeWallet = yield select((state: RootState) => activeWalletSelector(state))
  yield put(getBalance.requested(activeWallet))
}

function* deleteWallet(action: Action<DeleteWalletParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const id = action.payload.id
    const chain = action.payload.chain
    const address = action.payload.address
    const password = action.payload.password
    const keystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    assert(keystore && keystore.crypto, 'No keystore')
    const isValidPassword = yield call(walletCore.verifyPassword, password, keystore.crypto)
    assert(isValidPassword, 'Invalid password')
    yield call(secureStorage.removeItem, `IMPORTED_WALLET_KEYSTORE_${id}`)
    const activeWallet = yield select((state: RootState) => activeWalletSelector(state))

    if (activeWallet.id === id) {
      const walletAllIds = yield select((state: RootState) => walletAllIdsSelector(state))
      const walletAllIdsAfterAction = walletAllIds.filter((walletId: string) => walletId !== id)
      if (walletAllIdsAfterAction.length > 0) yield put(actions.setActiveWallet(walletAllIdsAfterAction[0]))
    }

    const fromCard = action.payload.fromCard

    if (!fromCard) {
      yield put(actions.removeImportedWallet(id))
    }

    yield put(actions.deleteWallet.succeeded())
    if (action.payload.componentId) popToRoot(action.payload.componentId)

    if (fromCard) {
      yield delay(500)
      yield put(actions.removeImportedWallet(id))
    }

    yield put(transactionActions.removeTransactions({ id: `${chain}/${address}` }))
  } catch (e) {
    yield put(actions.deleteWallet.failed(getErrorMessage(e)))
  }
}

function* exportMnemonics(action: Action<ExportMnemonicsParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const id = action.payload.id
    const password = action.payload.password
    const source = action.payload.source

    let keystore
    if (source === 'NEW_IDENTITY' || source === 'RECOVERED_IDENTITY') {
      keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    } else {
      keystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    }

    assert(keystore && keystore.crypto, 'No keystore')
    const mnemonics = yield call(walletCore.exportMnemonic, password, keystore)
    yield put(actions.exportMnemonics.succeeded())

    yield delay(500)
    if (action.payload.componentId) {
      showModal({
        stack: {
          children: [{
            component: {
              name: 'BitPortal.BackupIdentity',
              passProps: { mnemonics, backup: true },
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
    yield put(actions.exportMnemonics.failed(getErrorMessage(e)))
  }
}

function* importBTCMnemonics(action: Action<ImportBTCMnemonicsParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const mnemonic = action.payload.mnemonic
    const password = action.payload.password
    const isSegWit = action.payload.isSegWit
    const passwordHint = action.payload.passwordHint || ''
    const name = 'BTC-Wallet'
    const network = 'MAINNET'

    const keystore = yield call(walletCore.importBTCWalletByMnemonics, mnemonic, password, name, passwordHint, network, isSegWit)

    const walletAddresses = yield select((state: RootState) => walletAddressesSelector(state))
    assert(!walletAddresses.find((address: string) => address === keystore.address), 'Wallet already exist')

    yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${keystore.id}`, keystore, true)

    const wallet = walletCore.getWalletMetaData(keystore)
    yield put(actions.addImportedWallet(wallet))
    yield put(actions.setActiveWallet(wallet.id))

    yield put(actions.importBTCMnemonics.succeeded())
    if (action.payload.componentId) dismissAllModals()
  } catch (e) {
    yield put(actions.importBTCMnemonics.failed(getErrorMessage(e)))
  }
}

function* importBTCPrivateKey(action: Action<ImportBTCPrivateKeyParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const privateKey = action.payload.privateKey
    const password = action.payload.password
    const isSegWit = action.payload.isSegWit
    const passwordHint = action.payload.passwordHint || ''
    const name = 'BTC-Wallet'
    const network = 'MAINNET'

    const keystore = yield call(walletCore.importBTCWalletByPrivateKey, privateKey, password, name, passwordHint, network, isSegWit)

    const walletAddresses = yield select((state: RootState) => walletAddressesSelector(state))
    assert(!walletAddresses.find((address: string) => address === keystore.address), 'Wallet already exist')

    yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${keystore.id}`, keystore, true)

    const wallet = yield call(walletCore.getWalletMetaData, keystore)
    yield put(actions.addImportedWallet(wallet))
    yield put(actions.setActiveWallet(wallet.id))

    yield put(actions.importBTCPrivateKey.succeeded())
    if (action.payload.componentId) dismissAllModals()
  } catch (e) {
    yield put(actions.importBTCPrivateKey.failed(getErrorMessage(e)))
  }
}

function* exportBTCPrivateKey(action: Action<ExportBTCPrivateKeyParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const id = action.payload.id
    const password = action.payload.password
    const source = action.payload.source

    let keystore
    if (source === 'NEW_IDENTITY' || source === 'RECOVERED_IDENTITY') {
      keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    } else {
      keystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    }

    assert(keystore && keystore.crypto, 'No keystore')
    const privateKey = yield call(walletCore.exportPrivateKey, password, keystore, source)
    yield put(actions.exportBTCPrivateKey.succeeded())
    yield delay(500)

    if (action.payload.componentId) {
      push('BitPortal.ExportBTCPrivateKey', action.payload.componentId, {
        privateKey
      })
    }
  } catch (e) {
    yield put(actions.exportBTCPrivateKey.failed(getErrorMessage(e)))
  }
}

function* generateNewBTCAddress(action: Action<GenerateNewBTCAddressParams>) {
  if (!action.payload) return

  try {

  } catch (e) {
    yield put(actions.generateNewBTCAddress.failed(getErrorMessage(e)))
  }
}

function* switchBTCAddressType(action: Action<SwitchBTCAddressTypeParams>) {
  if (!action.payload) return

  try {
    const id = action.payload.id
    const password = action.payload.password
    const source = action.payload.source
    const segWit = action.payload.segWit

    let keystore
    const fromIdentity = source === 'NEW_IDENTITY' || source === 'RECOVERED_IDENTITY'
    if (fromIdentity) {
      keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    } else {
      keystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    }

    assert(keystore && keystore.crypto, 'No keystore')

    if (source === 'WIF') {
      const wif = yield call(walletCore.exportPrivateKey, password, keystore, source)

      const metadata = {
        name: keystore.bitportalMeta.name,
        passwordHint: keystore.bitportalMeta.passwordHint,
        network: keystore.bitportalMeta.network,
        source: keystore.bitportalMeta.source,
        timestamp: keystore.bitportalMeta.timestamp
      }

      const isSegWit = segWit === 'P2WPKH'
      const newKeystore = yield call(createBTCKeystore, metadata, wif, password, !isSegWit, id)

      if (fromIdentity) {
        yield call(secureStorage.setItem, `IDENTITY_WALLET_KEYSTORE_${id}`, newKeystore, true)
      } else {
        yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${id}`, newKeystore, true)
      }

      yield put(actions.updateBTCWalletAddressType({ id, address: newKeystore.address, segWit: newKeystore.bitportalMeta.segWit }))
    } else {
      const mnemonics = yield call(walletCore.exportMnemonic, password, keystore)
      const metadata = {
        name: keystore.bitportalMeta.name,
        passwordHint: keystore.bitportalMeta.passwordHint,
        network: keystore.bitportalMeta.network,
        source: keystore.bitportalMeta.source,
        timestamp: keystore.bitportalMeta.timestamp
      }
      const mnemonicCodes = mnemonics.trim().split(' ')
      const isSegWit = segWit === 'P2WPKH'
      const newKeystore = yield call(createHDBTCKeystore, metadata, mnemonicCodes, password, !isSegWit, id)

      if (fromIdentity) {
        yield call(secureStorage.setItem, `IDENTITY_WALLET_KEYSTORE_${id}`, newKeystore, true)
      } else {
        yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${id}`, newKeystore, true)
      }

      yield put(actions.updateBTCWalletAddressType({ id, address: newKeystore.address, segWit: newKeystore.bitportalMeta.segWit }))
    }

    yield put(actions.switchBTCAddressType.succeeded())
  } catch (e) {
    yield put(actions.switchBTCAddressType.failed(getErrorMessage(e)))
  }
}

function* importETHKeystore(action: Action<ImportETHKeystoreParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const keystoreText = action.payload.keystore
    const keystorePassword = action.payload.keystorePassword
    const passwordHint = ''
    const name = 'ETH-Wallet'

    let keystoreObject
    try {
      keystoreObject = JSON.parse(keystoreText)
    } catch (e) {
      throw new Error('Invalid keystore')
    }

    assert(keystoreObject.id, 'No keystore id')
    const id = keystoreObject.id

    const importedWallets = yield select((state: RootState) => importedWalletSelector(state))
    // assert(importedWallets.findIndex((wallet: any) => wallet.id === id) === -1, 'Keystore already exist in imported wallets')
    const identityWallets = yield select((state: RootState) => identityWalletSelector(state))
    // assert(identityWallets.findIndex((wallet: any) => wallet.id === id) === -1, 'Keystore already exist in identity wallets')

    if (keystoreObject.address) {
      const walletAddresses = yield select((state: RootState) => walletAddressesSelector(state))
      assert(!walletAddresses.find((address: string) => address === keystoreObject.address), 'Wallet already exist')
    }

    const keystore = yield call(walletCore.importETHWalletByKeystore, keystoreObject, keystorePassword, name, passwordHint)
    yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${keystore.id}`, keystore, true)

    const wallet = walletCore.getWalletMetaData(keystore)
    yield put(actions.addImportedWallet(wallet))
    yield put(actions.setActiveWallet(wallet.id))

    yield put(actions.importETHKeystore.succeeded())
    if (action.payload.componentId) dismissAllModals()
  } catch (e) {
    yield put(actions.importETHKeystore.failed(getErrorMessage(e)))
  }
}

function* importETHMnemonics(action: Action<ImportETHMnemonicsParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const mnemonic = action.payload.mnemonic
    const password = action.payload.password
    const path = action.payload.path || `m/44'/60'/0'/0/0`
    const passwordHint = action.payload.passwordHint || ''
    const name = 'ETH-Wallet'

    const keystore = yield call(walletCore.importETHWalletByMnemonics, mnemonic, password, name, passwordHint, path)

    const walletAddresses = yield select((state: RootState) => walletAddressesSelector(state))
    assert(!walletAddresses.find((address: string) => address === keystore.address), 'Wallet already exist')

    yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${keystore.id}`, keystore, true)

    const wallet = walletCore.getWalletMetaData(keystore)
    yield put(actions.addImportedWallet(wallet))
    yield put(actions.setActiveWallet(wallet.id))

    yield put(actions.importETHMnemonics.succeeded())
    if (action.payload.componentId) dismissAllModals()
  } catch (e) {
    yield put(actions.importETHMnemonics.failed(getErrorMessage(e)))
  }
}

function* importETHPrivateKey(action: Action<ImportETHPrivateKeyParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const privateKey = action.payload.privateKey
    const password = action.payload.password
    const passwordHint = action.payload.passwordHint || ''
    const name = 'ETH-Wallet'

    const keystore = yield call(walletCore.importETHWalletByPrivateKey, privateKey, password, name, passwordHint)

    const walletAddresses = yield select((state: RootState) => walletAddressesSelector(state))
    assert(!walletAddresses.find((address: string) => address === keystore.address), 'Wallet already exist')

    yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${keystore.id}`, keystore, true)

    const wallet = walletCore.getWalletMetaData(keystore)
    yield put(actions.addImportedWallet(wallet))
    yield put(actions.setActiveWallet(wallet.id))

    yield put(actions.importETHPrivateKey.succeeded())
    if (action.payload.componentId) dismissAllModals()
  } catch (e) {
    yield put(actions.importETHPrivateKey.failed(getErrorMessage(e)))
  }
}

function* exportETHPrivateKey(action: Action<ExportETHPrivateKeyParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const id = action.payload.id
    const password = action.payload.password
    const source = action.payload.source

    let keystore
    if (source === 'NEW_IDENTITY' || source === 'RECOVERED_IDENTITY') {
      keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    } else {
      keystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    }

    assert(keystore && keystore.crypto, 'No keystore')
    const privateKey = yield call(walletCore.exportPrivateKey, password, keystore)
    yield put(actions.exportETHPrivateKey.succeeded())
    yield delay(500)

    if (action.payload.componentId) {
      push('BitPortal.ExportETHPrivateKey', action.payload.componentId, {
        privateKey
      })
    }
  } catch (e) {
    yield put(actions.exportETHPrivateKey.failed(getErrorMessage(e)))
  }
}

function* exportETHKeystore(action: Action<ExportETHKeystoreParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const id = action.payload.id
    const password = action.payload.password
    const source = action.payload.source

    let keystore
    if (source === 'NEW_IDENTITY' || source === 'RECOVERED_IDENTITY') {
      keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    } else {
      keystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    }

    assert(keystore && keystore.crypto, 'No keystore')
    const isValidPassword = yield call(walletCore.verifyPassword, password, keystore.crypto)
    assert(isValidPassword, 'Invalid password')
    const exportableKeystore = {
      id: keystore.id,
      version: 3,
      address: keystore.address.slice(2).toLowerCase(),
      crypto: keystore.crypto
    }
    yield put(actions.exportETHKeystore.succeeded())
    yield delay(500)

    if (action.payload.componentId) {
      push('BitPortal.ExportETHKeystore', action.payload.componentId, {
        keystore: exportableKeystore
      })
    }
  } catch (e) {
    yield put(actions.exportETHKeystore.failed(getErrorMessage(e)))
  }
}

function* getEOSKeyAccounts(action: Action<GetEOSKeyAccountsParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const privateKey = action.payload.privateKey
    const password = action.payload.password
    const passwordHint = action.payload.passwordHint || ''
    const keyAccounts = yield call(getEOSKeyAccountsByPrivateKey, privateKey.trim())
    const importEOSAccountInfo = {
      privateKey,
      password,
      passwordHint,
      keyAccounts
    }
    yield call(memoryStorage.setItem, 'importEOSAccountInfo', importEOSAccountInfo, true)
    yield put(reset('importEOSWalletForm'))
    yield put(actions.getEOSKeyAccounts.succeeded())

    if (action.payload.componentId) {
      yield delay(500)
      push('BitPortal.SelectEOSAccount', action.payload.componentId, { keyAccounts })
    }
  } catch (e) {
    yield put(actions.getEOSKeyAccounts.failed(getEOSErrorMessage(e)))
  }
}

function* importEOSPrivateKey(action: Action<ImportEOSPrivateKeyParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const selected = action.payload.selected
    const importEOSAccountInfo = yield call(memoryStorage.getItem, 'importEOSAccountInfo', true)
    const {
      privateKey,
      password,
      passwordHint,
      keyAccounts
    } = importEOSAccountInfo
    const selectedKeyAccounts = keyAccounts.filter((account: any) => selected.indexOf(account.accountName) !== -1).map((account: any) => account.accountName)
    const keystores = yield call(walletCore.importEOSWalletsByPrivateKeys, [privateKey], password, 'EOS-Wallet', passwordHint, selectedKeyAccounts)

    for (const keystore of keystores) {
      yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${keystore.id}`, keystore, true)
    }

    const walletsInfo = keystores.map(walletCore.getWalletMetaData)

    yield put(actions.addImportedWallets(walletsInfo))
    yield put(actions.setActiveWallet(walletsInfo[0].id))
    yield put(actions.importEOSPrivateKey.succeeded())
    if (action.payload.componentId) dismissAllModals()
    yield call(memoryStorage.removeItem, 'importEOSAccountInfo')
  } catch (e) {
    yield put(actions.importEOSPrivateKey.failed(getErrorMessage(e)))
  }
}

function* exportEOSPrivateKey(action: Action<ExportEOSPrivateKeyParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const id = action.payload.id
    const address = action.payload.address
    const password = action.payload.password
    const source = action.payload.source
    const permissions = action.payload.permissions

    let keystore
    if (source === 'NEW_IDENTITY' || source === 'RECOVERED_IDENTITY') {
      keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    } else {
      keystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    }

    assert(keystore && keystore.crypto, 'No keystore')
    const keyPairs = yield call(walletCore.exportPrivateKeys, password, keystore)

    const permissionKeyPairs = yield call(getEOSPermissionKeyPairs, keyPairs, address, permissions)
    yield put(actions.exportEOSPrivateKey.succeeded())
    yield delay(500)

    if (action.payload.componentId) {
      push('BitPortal.ExportEOSPrivateKey', action.payload.componentId, {
        permissionKeyPairs
      })
    }
  } catch (e) {
    yield put(actions.exportEOSPrivateKey.failed(getErrorMessage(e)))
  }
}

function* setEOSWalletAddress(action: Action<SetEOSWalletAddressParams>) {
  if (!action.payload) return
  const oldAddress = action.payload.oldAddress
  const id = action.payload.id
  const address = action.payload.address

  try {
    yield put(actions.updateEOSWalletAddress({ address, id }))
    const keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    keystore.address = address
    yield call(secureStorage.setItem, `IDENTITY_WALLET_KEYSTORE_${id}`, keystore, true)
    yield put(actions.setEOSWalletAddress.succeeded())
  } catch (e) {
    yield put(actions.updateEOSWalletAddress({ address: oldAddress, id }))
    yield put(actions.setEOSWalletAddress.failed(getErrorMessage(e)))
  }
}

function* setWalletName(action: Action<SetWalletNameParams>) {
  if (!action.payload) return
  const oldName = action.payload.oldName
  const id = action.payload.id
  const name = action.payload.name

  try {
    yield put(actions.updateWalletName({ name, id }))

    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)

    if (identityKeystore) {
      identityKeystore.name = name
      identityKeystore.bitportalMeta.name = name
      yield call(secureStorage.setItem, `IDENTITY_WALLET_KEYSTORE_${id}`, identityKeystore, true)
      yield put(actions.setWalletName.succeeded())
      return
    }

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)

    if (importedKeystore) {
      importedKeystore.name = name
      importedKeystore.bitportalMeta.name = name
      yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${id}`, importedKeystore, true)
      yield put(actions.setWalletName.succeeded())
      return
    }
  } catch (e) {
    yield put(actions.updateWalletName({ name: oldName, id }))
    yield put(actions.setWalletName.failed(getErrorMessage(e)))
  }
}

function* importChainxMnemonics(action: Action<ImportChainxMnemonicsParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const mnemonic = action.payload.mnemonic
    const password = action.payload.password
    const passwordHint = action.payload.passwordHint || ''
    const name = 'ChainX-Wallet'
    const network = 'MAINNET'

    const keystore = yield call(walletCore.importChainxWalletByMnemonics, mnemonic, password, name, passwordHint, network)

    const walletAddresses = yield select((state: RootState) => walletAddressesSelector(state))
    assert(!walletAddresses.find((address: string) => address === keystore.address), 'Wallet already exist')

    yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${keystore.id}`, keystore, true)

    const wallet = walletCore.getWalletMetaData(keystore)
    yield put(actions.addImportedWallet(wallet))
    yield put(actions.setActiveWallet(wallet.id))

    yield put(actions.importChainxMnemonics.succeeded())
    if (action.payload.componentId) dismissAllModals()
  } catch (e) {
    yield put(actions.importChainxMnemonics.failed(getErrorMessage(e)))
  }
}

function* importChainxPrivateKey(action: Action<ImportChainxPrivateKeyParams>) {
  if (!action.payload) return
  if (action.payload.delay) yield delay(action.payload.delay)

  try {
    const privateKey = action.payload.privateKey
    const password = action.payload.password
    const passwordHint = action.payload.passwordHint || ''
    const name = 'ChainX-Wallet'
    const network = 'MAINNET'

    const keystore = yield call(walletCore.importChainxWalletByPrivateKey, privateKey, password, name, passwordHint, network)

    const walletAddresses = yield select((state: RootState) => walletAddressesSelector(state))
    assert(!walletAddresses.find((address: string) => address === keystore.address), 'Wallet already exist')

    yield call(secureStorage.setItem, `IMPORTED_WALLET_KEYSTORE_${keystore.id}`, keystore, true)

    const wallet = yield call(walletCore.getWalletMetaData, keystore)
    yield put(actions.addImportedWallet(wallet))
    yield put(actions.setActiveWallet(wallet.id))

    yield put(actions.importChainxPrivateKey.succeeded())
    if (action.payload.componentId) dismissAllModals()
  } catch (e) {
    yield put(actions.importChainxPrivateKey.failed(getErrorMessage(e)))
  }
}

export default function* walletSaga() {
  yield takeLatest(String(actions.setActiveWallet), setActiveWallet)
  yield takeLatest(String(actions.deleteWallet.requested), deleteWallet)
  yield takeLatest(String(actions.exportMnemonics.requested), exportMnemonics)
  yield takeLatest(String(actions.importBTCMnemonics.requested), importBTCMnemonics)
  yield takeLatest(String(actions.importBTCPrivateKey.requested), importBTCPrivateKey)
  yield takeLatest(String(actions.exportBTCPrivateKey.requested), exportBTCPrivateKey)
  yield takeLatest(String(actions.generateNewBTCAddress.requested), generateNewBTCAddress)
  yield takeLatest(String(actions.switchBTCAddressType.requested), switchBTCAddressType)
  yield takeLatest(String(actions.importETHKeystore.requested), importETHKeystore)
  yield takeLatest(String(actions.importETHMnemonics.requested), importETHMnemonics)
  yield takeLatest(String(actions.importETHPrivateKey.requested), importETHPrivateKey)
  yield takeLatest(String(actions.exportETHPrivateKey.requested), exportETHPrivateKey)
  yield takeLatest(String(actions.exportETHKeystore.requested), exportETHKeystore)
  yield takeLatest(String(actions.importEOSPrivateKey.requested), importEOSPrivateKey)
  yield takeLatest(String(actions.getEOSKeyAccounts.requested), getEOSKeyAccounts)
  yield takeLatest(String(actions.exportEOSPrivateKey.requested), exportEOSPrivateKey)
  yield takeLatest(String(actions.setEOSWalletAddress.requested), setEOSWalletAddress)
  yield takeLatest(String(actions.setWalletName.requested), setWalletName)
  yield takeLatest(String(actions.importChainxMnemonics.requested), importChainxMnemonics)
  yield takeLatest(String(actions.importChainxPrivateKey.requested), importChainxPrivateKey)
}
