import assert from 'assert'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import * as actions from 'actions/keyAccount'
import { updateAccount } from 'actions/account'
import { updateEOSWalletAddress } from 'actions/wallet'
import { getEOSKeyAccountsByPublicKey } from 'core/chain/eos'
import secureStorage from 'core/storage/secureStorage'
import * as api from 'utils/api'

function* getKeyAccount(action: Action) {
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
        yield put(updateAccount({ id, ...accountInfo }))
      }

      yield put(actions.updateKeyAccount({ id: `${chain}/${publicKey}`, accounts: keyAccounts, publicKey }))
    }

    if (!wallet.address && !!accountNames.length) {
      const address = accountNames[0]
      const id = wallet.id
      const keystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
      keystore.address = address
      yield call(secureStorage.setItem, `IDENTITY_WALLET_KEYSTORE_${id}`, keystore, true)
      yield put(updateEOSWalletAddress({ address, id }))
    }

    yield put(actions.getKeyAccount.succeeded())
  } catch (e) {
    yield put(actions.getKeyAccount.failed(getErrorMessage(e)))
  }
}

export default function* keyAccountSaga() {
  yield takeLatest(String(actions.getKeyAccount.requested), getKeyAccount)
  yield takeLatest(String(actions.getKeyAccount.refresh), getKeyAccount)
}
