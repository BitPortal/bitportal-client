import assert from 'assert'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import * as actions from 'actions/account'
import { updateEOSWalletAddress } from 'actions/wallet'
import { getAccount as getEOSAccount, getEOSKeyAccountsByPublicKey } from 'core/chain/eos'
import secureStorage from 'core/storage/secureStorage'
import * as api from 'utils/api'

function* getAccount(action: Action) {
  if (!action.payload) return

  try {
    const chain = action.payload.chain
    const address = action.payload.address

    let id = `${chain}/${address}`

    if (chain === 'EOS') {
      const result = yield call(getEOSAccount, address)
      result.id = id
      yield put(actions.updateAccount(result))
    }

    yield put(actions.getAccount.succeeded())
  } catch (e) {
    yield put(actions.getAccount.failed(getErrorMessage(e)))
  }
}

function* createEOSAccount(action: Action) {
  if (!action.payload) return

  try {
    const walletId = action.payload.accountName
    const inviteCode = action.payload.inviteCode
    const ownerKey = action.payload.ownerKey
    const activeKey = action.payload.activeKey
    const chainType = 'eos'

    yield call(api.createEOSAccount, { walletId, inviteCode, ownerKey, activeKey, chainType })
    yield put(actions.createEOSAccount.succeeded())
  } catch (e) {
    yield put(actions.createEOSAccount.failed(getErrorMessage(e)))
  }
}

function* syncEOSAccount(action: Action) {
  if (!action.payload) return

  try {
    const wallet = action.payload
    const chain = wallet.chain
    const publicKeys = wallet.publicKeys

    let accountNames = []

    for (const publicKey of publicKeys) {
      const keyAccounts = yield call(getEOSKeyAccountsByPublicKey, publicKey)
      accountNames = [...accountNames, ...keyAccounts.map((keyAccounts: any) => keyAccounts.accountName)]

      for (const keyAccount of keyAccounts) {
        const accountInfo = keyAccount.accountInfo
        const address = accountInfo.account_name
        const id = `${chain}/${address}`
        yield put(actions.updateAccount({ id, ...accountInfo }))
      }
    }

    if (!wallet.address && !!accountNames.length) {
      const address = accountNames[0]
      const id = wallet.id
      const keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
      keystore.address = address
      yield call(secureStorage.setItem, `IDENTITY_WALLET_KEYSTORE_${id}`, keystore, true)
      yield put(updateEOSWalletAddress({ address, id }))
    }

    yield put(actions.syncEOSAccount.succeeded())
  } catch (e) {
    yield put(actions.syncEOSAccount.failed(getErrorMessage(e)))
  }
}

export default function* accountSaga() {
  yield takeLatest(String(actions.getAccount.requested), getAccount)
  yield takeLatest(String(actions.getAccount.refresh), getAccount)
  yield takeLatest(String(actions.syncEOSAccount.requested), syncEOSAccount)
  yield takeLatest(String(actions.createEOSAccount.requested), createEOSAccount)
}
