import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/bridge'
import { updateBridgeWalletInfo } from 'actions/wallet'
import { parseMessageId, typeOf, validateEOSActions } from 'utils'
import { bridgeAccountSelector } from 'selectors/account'
import { bridgeWalletSelector } from 'selectors/wallet'
import secureStorage from 'core/storage/secureStorage'
import {
  initEOS,
  transferEOSAsset,
  voteEOSProducers,
  pushEOSAction,
  eosAuthSign,
  signature,
  // verify
} from 'core/legacy/eos'
import {
  getEOSPermissionPublicKeyPairs,
  getActivePermissionPublicKeyPair,
  getContract,
  sign,
  signData
} from 'core/chain/eos'
import * as ethChain from 'core/chain/etheruem'

function* pendTransferEOSAsset(messageActionType: string, payload: any, messageId: string) {
}

function* pendVoteEOSProducers(messageActionType: string, payload: any, messageId: string) {
}

function* pendPushEOSAction(messageActionType: string, payload: any, messageId: string) {
}

function* pendSignEOSData(messageActionType: string, payload: any, messageId: string) {
}

function* pendRequestSignature(messageActionType: string, payload: any, messageId: string) {
  const hasPendingMessage = yield select((state: RootState) => state.bridge.hasPendingMessage)
  if (hasPendingMessage) {
    const pendingMessageActionType = yield select((state: RootState) => state.bridge.pendingMessage.type)
    yield put(actions.sendMessage({
      messageId,
      type: 'actionFailed',
      payload: {
        error: {
          message: `There's a pending request: ${pendingMessageActionType}`
        }
      }
    }))
    return
  }

  const requiredFields = payload.requiredFields
  const buf = payload.buf
  const transaction = payload.transaction
  const blockchain = 'EOS'

  yield put(actions.pendMessage({
    messageId,
    payload,
    type: messageActionType,
    info: {
      requiredFields,
      buf,
      transaction,
      blockchain
    }
  }))

  yield put(updateBridgeWalletInfo())
}

function* pendArbitrarySignature(messageActionType: string, payload: any, messageId: string) {
  const hasPendingMessage = yield select((state: RootState) => state.bridge.hasPendingMessage)
  if (hasPendingMessage) {
    const pendingMessageActionType = yield select((state: RootState) => state.bridge.pendingMessage.type)
    yield put(actions.sendMessage({
      messageId,
      type: 'actionFailed',
      payload: {
        error: {
          message: `There's a pending request: ${pendingMessageActionType}`
        }
      }
    }))
    return
  }

  const data = payload.data
  const isHash = payload.isHash
  const permission = payload.permission
  const blockchain = 'EOS'

  yield put(actions.pendMessage({
    messageId,
    payload,
    type: messageActionType,
    info: {
      data,
      blockchain,
      isHash,
      permission
    }
  }))

  yield put(updateBridgeWalletInfo())
}

function* pendETHRPCRequest(messageActionType: string, payload: any, messageId: string, info: any = {}) {
  const hasPendingMessage = yield select((state: RootState) => state.bridge.hasPendingMessage)
  if (hasPendingMessage) {
    const pendingMessageActionType = yield select((state: RootState) => state.bridge.pendingMessage.type)
    yield put(actions.sendMessage({
      messageId,
      type: 'actionFailed',
      payload: {
        error: {
          message: `There's a pending request: ${pendingMessageActionType}`
        }
      }
    }))
    return
  }

  const blockchain = 'ETHEREUM'

  yield put(actions.pendMessage({
    messageId,
    payload,
    type: messageActionType,
    info: {
      blockchain,
      ...info
    }
  }))

  yield put(updateBridgeWalletInfo())
}

function* resolveTransferEOSAsset(password: string, info: any, messageId: string) {
}

function* resolveVoteEOSProducers(password: string, info: any, messageId: string) {
}

function* resolvePushEOSAction(password: string, info: any, messageId: string) {
}

function* resolveSignEOSData(password: string, info: any, messageId: string) {
}

function* resolveETHPersonalSign(password: string, params: any, messageId: string) {
  try {
    const data = params[0]
    const wallet = yield select((state: RootState) => bridgeWalletSelector(state))
    const id = wallet.id

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    const signature = yield call(
      ethChain.personalSign,
      password,
      keystore,
      data
    )

    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: signature
      }
    }))
  } catch (error) {
    yield put(actions.resolveMessageFailed(error.message))
  }
}

function* resolveETHSignTypedData(password: string, params: any, messageId: string) {
  try {
    const data = params[0]
    const wallet = yield select((state: RootState) => bridgeWalletSelector(state))
    const id = wallet.id

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    const signature = yield call(
      ethChain.typedDataSign,
      password,
      keystore,
      data
    )

    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: signature
      }
    }))
  } catch (error) {
    yield put(actions.resolveMessageFailed(error.message))
  }
}

function* resolveETHSignTypedDataV3(password: string, params: any, messageId: string) {
  try {
    const data = params[1]
    const wallet = yield select((state: RootState) => bridgeWalletSelector(state))
    const id = wallet.id

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    const signature = yield call(
      ethChain.typedDataSignV3,
      password,
      keystore,
      data
    )

    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: signature
      }
    }))
  } catch (error) {
    yield put(actions.resolveMessageFailed(error.message))
  }
}


function* resolveETHSignTypedDataV4(password: string, params: any, messageId: string) {
  try {
    const data = params[1]
    const wallet = yield select((state: RootState) => bridgeWalletSelector(state))
    const id = wallet.id

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    const signature = yield call(
      ethChain.typedDataSignV4,
      password,
      keystore,
      data
    )

    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: signature
      }
    }))
  } catch (error) {
    yield put(actions.resolveMessageFailed(error.message))
  }
}

function* resolveETHSign(password: string, params: any, messageId: string) {
  try {
    const data = params[1]
    const wallet = yield select((state: RootState) => bridgeWalletSelector(state))
    const id = wallet.id

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    const signature = yield call(
      ethChain.ethSign,
      password,
      keystore,
      data
    )

    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: signature
      }
    }))
  } catch (error) {
    yield put(actions.resolveMessageFailed(error.message))
  }
}

function* resolveETHSendTransaction(password: string, params: any, messageId: string, info: any) {
  try {
    const data = params[0]
    const wallet = yield select((state: RootState) => bridgeWalletSelector(state))
    const id = wallet.id

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    const hash = yield call(
      ethChain.sendTransaction,
      password,
      keystore,
      { ...data, gasLimit: info.gas, gasPrice: info.gasPriceHex }
    )

    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: hash
      }
    }))
  } catch (error) {
    yield put(actions.resolveMessageFailed(error.message))
  }
}

function* resolveETHSignTransaction(password: string, params: any, messageId: string, info: any) {
  try {
    const data = params[0]
    const wallet = yield select((state: RootState) => bridgeWalletSelector(state))
    const id = wallet.id

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    const result = yield call(
      ethChain.sendTransaction,
      password,
      keystore,
      { ...data, gasLimit: info.gas, gasPrice: info.gasPriceHex }
    )

    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: result
      }
    }))
  } catch (error) {
    yield put(actions.resolveMessageFailed(error.message))
  }
}

function* resolveRequestSignature(password: string, info: any, messageId: string) {
  try {
    const buf = info.buf
    const permission = [...new Set(info.transaction.actions.map((action: any) => action.authorization.map((auth: any) => auth.permission)).flat())][0]
    const wallet = yield select((state: RootState) => bridgeWalletSelector(state))
    const account = yield select((state: RootState) => bridgeAccountSelector(state))
    const accountName = wallet.address
    const id = wallet.id
    const permissions = account && account.permissions

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    const signatures = yield call(
      sign,
      password,
      keystore,
      buf,
      accountName,
      permissions,
      permission
    )
    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: { signatures, returnedFields: [] }
      }
    }))
  } catch (error) {
    yield put(actions.resolveMessageFailed(error.message))
  }
}

function* resolveRequestArbitrarySignature(password: string, info: any, messageId: string) {
  try {
    const data = info.data
    const isHash = info.isHash
    const permission = info.permission
    const wallet = yield select((state: RootState) => bridgeWalletSelector(state))
    const account = yield select((state: RootState) => bridgeAccountSelector(state))
    const accountName = wallet.address
    const id = wallet.id
    const permissions = account && account.permissions

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    const signedData = yield call(
      signData,
      password,
      keystore,
      data,
      account,
      isHash,
      permissions,
      permission
    )

    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: signedData
      }
    }))
  } catch (error) {
    yield put(actions.resolveMessageFailed(error.message))
  }
}

function* receiveMessage(action: Action<string>) {
  if (!action.payload) return

  const message = action.payload
  const messageId = parseMessageId(message)
  let messageAction

  try {
    messageAction = JSON.parse(message)
  } catch (error) {

    if (messageId) {
      yield put(actions.sendMessage({
        messageId,
        type: 'actionFailed',
        payload: {
          error: {
            message: 'parseMessageError: error.message'
          }
        }
      }))
      return
    }
  }

  try {
    const messageId = messageAction.messageId
    const payload = messageAction.payload
    const messageActionType = messageAction.type
    // console.log('receive bridge message', action)

    switch (messageActionType) {
    case 'getOrRequestIdentity':
      {
        const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
        assert(activeWallet && activeWallet.chain === 'EOS', 'No active EOS wallet in BitPortal!')
        const activeAccount = yield select((state: RootState) => bridgeAccountSelector(state))
        const permissions = activeAccount && activeAccount.permissions
        const permissionPublicKeyPairs = yield call(getEOSPermissionPublicKeyPairs, activeWallet.publicKeys, activeWallet.address, permissions)
        const activePermissionPublicKeyPair = yield call(getActivePermissionPublicKeyPair, permissionPublicKeyPairs)
        yield put(actions.sendMessage({
          messageId,
          type: 'actionSucceeded',
          payload: {
            data: {
              hash: 'test',
              kyc: false,
              name: 'test',
              publicKey: activePermissionPublicKeyPair.publicKey,
              accounts: [{
                authority: activePermissionPublicKeyPair.permission,
                blockchain: 'eos',
                name: activeWallet.address
              }]
            }
          }
        }))
      }
      break
    case 'abiCache':
      {
        const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
        assert(activeWallet && activeWallet.chain === 'EOS'&& !!activeWallet.address, 'No active EOS wallet in BitPortal!')
        const contract = yield call(getContract, payload.abiContractName)
        yield put(actions.sendMessage({
          messageId,
          type: 'actionSucceeded',
          payload: {
            data: { ...contract.fc, timestamp: +new Date(), account_name: payload.abiContractName }
          }
        }))
      }
      break
    case 'requestSignature':
      {
        const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
        assert(activeWallet && activeWallet.chain === 'EOS' && !!activeWallet.address, 'No active EOS wallet in BitPortal!')

        const transactionActions = payload.transaction.actions
        yield put(actions.loadContract())

        const newActions = []
        for (const action of transactionActions) {
          const contract = yield call(getContract, action.account)
          newActions.push({ ...action, data: contract.fc.fromBuffer(action.name, action.data) })
        }

        const errorMessage = validateEOSActions(newActions, activeWallet.address)
        assert(!errorMessage, errorMessage)

        const activeAccount = yield select((state: RootState) => bridgeAccountSelector(state))
        const permissions = activeAccount && activeAccount.permissions
        const permissionPublicKeyPairs = yield call(getEOSPermissionPublicKeyPairs, activeWallet.publicKeys, activeWallet.address, permissions)
        const activePermissionPublicKeyPair = yield call(getActivePermissionPublicKeyPair, permissionPublicKeyPairs)

        yield pendRequestSignature(messageActionType, {
          ...payload,
          transaction: { ...payload.transaction, actions: newActions },
          account: activeWallet.address,
          publicKey: activePermissionPublicKeyPair.publicKey
        }, messageId)
      }
      break
    case 'requestArbitrarySignature':
      {
        const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
        assert(activeWallet && activeWallet.chain === 'EOS' && !!activeWallet.address, 'No active EOS wallet in BitPortal!')

        const activeAccount = yield select((state: RootState) => bridgeAccountSelector(state))
        const permissions = activeAccount && activeAccount.permissions
        const permissionPublicKeyPairs = yield call(getEOSPermissionPublicKeyPairs, activeWallet.publicKeys, activeWallet.address, permissions)
        const activePermissionPublicKeyPair = yield call(getActivePermissionPublicKeyPair, permissionPublicKeyPairs)

        yield pendArbitrarySignature(messageActionType, {
          ...payload,
          account: activeWallet.address,
          publicKey: activePermissionPublicKeyPair.publicKey,
          permission: activePermissionPublicKeyPair.permission
        }, messageId)
      }
      break
    case 'authenticate':
      {
        const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
        assert(activeWallet && activeWallet.chain === 'EOS' && !!activeWallet.address, 'No active EOS wallet in BitPortal!')

        const activeAccount = yield select((state: RootState) => bridgeAccountSelector(state))
        const permissions = activeAccount && activeAccount.permissions
        const permissionPublicKeyPairs = yield call(getEOSPermissionPublicKeyPairs, activeWallet.publicKeys, activeWallet.address, permissions)
        const activePermissionPublicKeyPair = yield call(getActivePermissionPublicKeyPair, permissionPublicKeyPairs)
        const host = yield select((state: RootState) => state.bridge.host)

        yield pendArbitrarySignature(messageActionType, {
          ...payload,
          data: host,
          account: activeWallet.address,
          publicKey: activePermissionPublicKeyPair.publicKey,
          permission: activePermissionPublicKeyPair.name
        }, messageId)
      }
      break
    case 'forgetIdentity':
    case 'requestAddNetwork':
      {
        yield put(actions.sendMessage({
          messageId,
          type: 'actionSucceeded',
          payload: {
            data: true
          }
        }))
      }
      break
    case 'eth_rpc_request':
      {
        const method = payload.method

        switch (method) {
        case 'eth_requestAccounts':
        case 'eth_accounts':
          {
            const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
            assert(activeWallet && activeWallet.chain === 'ETHEREUM' && !!activeWallet.address, 'No active ETHEREUM wallet in BitPortal!')

            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: [activeWallet.address.toLowerCase()]
              }
            }))
          }
          break
        case 'net_version':
          {
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: '1'
              }
            }))
          }
          break
        case 'web3_clientVersion':
          {
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: 'MetaMask/v6.4.1'
              }
            }))
          }
          break
        case 'eth_getCode':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const address = payload.params[0]
            const code = yield call(ethChain.getCode, address)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: code
              }
            }))
          }
          break
        case 'eth_coinbase':
          {
            const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
            assert(activeWallet && activeWallet.chain === 'ETHEREUM' && !!activeWallet.address, 'No active ETHEREUM wallet in BitPortal!')

            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: activeWallet.address
              }
            }))
          }
          break
        case 'net_listening':
          {
            const result = yield call(ethChain.isListening)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result || true
              }
            }))
          }
          break
        case 'net_peerCount':
          {
            const result = yield call(ethChain.getPeerCount)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result || '0x2'
              }
            }))
          }
          break
        case 'eth_protocolVersion':
          {
            const result = yield call(ethChain.getProtocolVersion)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result || '63'
              }
            }))
          }
          break
        case 'eth_blockNumber':
          {
            const blockNumber = yield call(ethChain.getBlockNumber)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: blockNumber
              }
            }))
          }
          break
        case 'eth_estimateGas':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const estimateGas = yield call(ethChain.getEstimategas, payload.params[0])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: estimateGas
              }
            }))
          }
          break
        case 'eth_gasPrice':
          {
            const gasPrice = yield call(ethChain.getGasPrice)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: gasPrice
              }
            }))
          }
          break
        case 'eth_getBalance':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const balance = yield call(ethChain.getWeb3Balance, payload.params[0])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: balance
              }
            }))
          }
          break
        case 'eth_getBlockByNumber':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const block = yield call(ethChain.getBlock, !isNaN(payload.params[0]) ? +payload.params[0] : payload.params[0], Boolean(payload.params[1]))
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: block
              }
            }))
          }
          break
        case 'eth_getBlockByHash':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const block = yield call(ethChain.getBlock, payload.params[0], Boolean(payload.params[1]))
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: block
              }
            }))
          }
          break
        case 'eth_getStorageAt':
          {
            assert(payload.params && payload.params[0] && payload.params[1], 'Invalid params!')
            const storage = yield call(ethChain.getStorageAt, payload.params[0], +payload.params[1])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: storage
              }
            }))
          }
          break
        case 'eth_getTransactionByBlockHashAndIndex':
          {
            assert(payload.params && payload.params[0] && payload.params[1], 'Invalid params!')
            const transaction = yield call(ethChain.getTransactionFromBlock, payload.params[0], +payload.params[1])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: transaction
              }
            }))
          }
          break
        case 'eth_getTransactionByBlockNumberAndIndex':
          {
            assert(payload.params && payload.params[0] && payload.params[1], 'Invalid params!')
            const transaction = yield call(ethChain.getTransactionFromBlock, !isNaN(payload.params[0]) ? +payload.params[0] : payload.params[0], +payload.params[1])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: transaction
              }
            }))
          }
          break
        case 'eth_getTransactionByHash':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const transaction = yield call(ethChain.getTransaction, payload.params[0])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: transaction
              }
            }))
          }
          break
        case 'eth_getTransactionCount':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const count = yield call(ethChain.getTransactionCount, payload.params[0], payload.params[1])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: count
              }
            }))
          }
          break
        case 'eth_getTransactionReceipt':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const receipt = yield call(ethChain.getTransactionReceipt, payload.params[0])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: receipt
              }
            }))
          }
          break
        case 'eth_getUncleByBlockHashAndIndex':
          {
            assert(payload.params && payload.params[0] && payload.params[1], 'Invalid params!')
            const transaction = yield call(ethChain.getUncle, payload.params[0], +payload.params[1], !!payload.params[2])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: transaction
              }
            }))
          }
          break
        case 'eth_getUncleByBlockNumberAndIndex':
          {
            assert(payload.params && payload.params[0] && payload.params[1], 'Invalid params!')
            const transaction = yield call(ethChain.getUncle, !isNaN(payload.params[0]) ? +payload.params[0] : payload.params[0], +payload.params[1], !!payload.params[2])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: transaction
              }
            }))
          }
          break
        case 'eth_getBlockTransactionCountByHash':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const count = yield call(ethChain.getBlockTransactionCount, payload.params[0])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: count
              }
            }))
          }
          break
        case 'eth_getBlockTransactionCountByNumber':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const count = yield call(ethChain.getBlockTransactionCount, !isNaN(payload.params[0]) ? +payload.params[0] : payload.params[0])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: count
              }
            }))
          }
          break
        case 'eth_getWork':
          {
            const result = yield call(ethChain.getWork)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result
              }
            }))
          }
          break
        case 'eth_hashrate':
          {
            const result = yield call(ethChain.getHashrate)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result
              }
            }))
          }
          break
        case 'eth_mining':
          {
            const result = yield call(ethChain.isMining)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result || true
              }
            }))
          }
          break
        case 'eth_syncing':
          {
            const result = yield call(ethChain.isSyncing)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result || true
              }
            }))
          }
          break
        case 'eth_submitWork':
          {
            assert(payload.params && payload.params[0] && payload.params[1] && payload.params[2], 'Invalid params!')
            const result = yield call(ethChain.submitWork, payload.params[0], payload.params[1], payload.params[2])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result
              }
            }))
          }
          break
        case 'web3_sha3':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const data = payload.params[0]
            const hash = yield call(ethChain.web3Sha3, data)
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: hash
              }
            }))
          }
          break
        case 'eth_call':
          {
            assert(payload.params && payload.params[0] && typeof payload.params[0] === 'object', 'Invalid params!')
            const result = yield call(ethChain.call, payload.params[0], payload.params[1])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result
              }
            }))
          }
          break
        case 'personal_sign':
          {
            const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
            assert(activeWallet && activeWallet.chain === 'ETHEREUM' && !!activeWallet.address, 'No active ETHEREUM wallet in BitPortal!')

            assert(payload.params && payload.params[0] && payload.params[1], 'Invalid params!')
            assert(typeof payload.params[1] === 'string' || typeof payload.params[1] === number, 'Invalid address params!')

            if (typeof payload.params[1] === 'string') {
              assert(String(activeWallet.address).toLowerCase() === String(payload.params[1]).toLowerCase(), `No wallet of address: ${payload.params[1]}`)
            } else {
              assert(payload.params[1] == 0, `Invalid address index: ${payload.params[1]}`)
            }

            const info = {
              data: ethChain.hexToUtf8(payload.params[0])
            }

            yield pendETHRPCRequest(messageActionType, payload, messageId, info)
          }
          break
        case 'personal_ecRecover':
          {
            const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
            assert(activeWallet && activeWallet.chain === 'ETHEREUM' && !!activeWallet.address, 'No active ETHEREUM wallet in BitPortal!')
            assert(payload.params && payload.params[0] && payload.params[1], 'Invalid params!')

            const result = yield call(ethChain.personalEcRecover, payload.params[0], payload.params[1])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result
              }
            }))
          }
          break
        case 'eth_signTransaction':
        case 'eth_sendTransaction':
          {
            const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
            assert(activeWallet && activeWallet.chain === 'ETHEREUM' && !!activeWallet.address, 'No active ETHEREUM wallet in BitPortal!')
            assert(payload.params && payload.params[0] && typeof payload.params[0] === 'object' && payload.params[0].from && payload.params[0].to, 'Invalid params!')
            assert(String(activeWallet.address).toLowerCase() === String(payload.params[0].from).toLowerCase(), `No wallet of address: ${payload.params[1]}`)

            const params = payload.params[0]

            let gasPrice
            let gasPriceHex
            if (!params.gasPrice) {
              const price = yield call(ethChain.getGasPrice)
              gasPrice = ethChain.bigValuePow(+price, -18)
              gasPriceHex = price
            } else {
              gasPrice = ethChain.bigValuePow(+params.gasPrice, -18)
              gasPriceHex = params.gasPrice
            }

            let gas = (params.gas && +params.gas)
            if (!gas) {
              gas = yield call(ethChain.estimateGas, params)
            }

            const data = ethChain.decodeData(params.data)

            const info = {
              fromAddress: params.from,
              toAddress: params.to,
              amount: ethChain.bigValuePow(+(params.value || 0), -18),
              data: params.data,
              gasPrice,
              gas,
              gasFee: gas * gasPrice,
              data,
              gasPriceHex
            }

            yield pendETHRPCRequest(messageActionType, payload, messageId, info)
          }
          break
        case 'eth_sendRawTransaction':
          {
            assert(payload.params && payload.params[0], 'Invalid params!')
            const result = yield call(ethChain.sendRawTransaction, payload.params[0])
            yield put(actions.sendMessage({
              messageId,
              type: 'actionSucceeded',
              payload: {
                data: result
              }
            }))
          }
          break
        case 'eth_signTypedData':
          {
            const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
            assert(activeWallet && activeWallet.chain === 'ETHEREUM' && !!activeWallet.address, 'No active ETHEREUM wallet in BitPortal!')
            assert(payload.params && payload.params[0] && typeof payload.params[0] === 'object' && payload.params[1], 'Invalid params!')
            assert(String(activeWallet.address).toLowerCase() === String(payload.params[1]).toLowerCase(), `No wallet of address: ${payload.params[1]}`)

            const info = {
              data: payload.params[0]
            }

            yield pendETHRPCRequest(messageActionType, payload, messageId, info)
          }
          break
        case 'eth_signTypedData_v3':
        case 'eth_signTypedData_v4':
          {
            const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
            assert(activeWallet && activeWallet.chain === 'ETHEREUM' && !!activeWallet.address, 'No active ETHEREUM wallet in BitPortal!')
            assert(payload.params && payload.params[0] && payload.params[1], 'Invalid params!')
            assert(String(activeWallet.address).toLowerCase() === String(payload.params[0]).toLowerCase(), `No wallet of address: ${payload.params[1]}`)

            const typedData = JSON.parse(payload.params[1])
            delete typedData.types
            delete typedData.primaryType

            const info = {
              data: typedData
            }

            yield pendETHRPCRequest(messageActionType, payload, messageId, info)
          }
          break
        case 'eth_sign':
          {
            const activeWallet = yield select((state: RootState) => bridgeWalletSelector(state))
            assert(activeWallet && activeWallet.chain === 'ETHEREUM' && !!activeWallet.address, 'No active ETHEREUM wallet in BitPortal!')

            assert(payload.params && payload.params[0] && payload.params[1], 'Invalid params!')
            assert(typeof payload.params[0] === 'string' || typeof payload.params[0] === number, 'Invalid address params!')

            if (typeof payload.params[0] === 'string')
            {
              assert(String(activeWallet.address).toLowerCase() === String(payload.params[0]).toLowerCase(), `No wallet of address: ${payload.params[1]}`)
            } else {
              assert(payload.params[0] == 0, `Invalid address index: ${payload.params[1]}`)
            }

            const info = {
              data: payload.params[1]
            }

            yield pendETHRPCRequest(messageActionType, payload, messageId, info)
          }
          break
        case 'eth_submitHashrate':
        case 'eth_uninstallFilter':
        case 'eth_getUncleCountByBlockHash':
        case 'eth_getUncleCountByBlockNumber':
        case 'eth_newBlockFilter':
        case 'eth_newFilter':
        case 'eth_newPendingTransactionFilter':
        case 'eth_getFilterChanges':
        case 'eth_getFilterLogs':
        case 'eth_getLogs':
        default:
          if (messageId) {
            yield put(actions.sendMessage({
              messageId,
              type: 'actionFailed',
              payload: {
                error: {
                  message: `Unsupported rpc api: ${method}`
                }
              }
            }))
          }
          break
        }
      }
      break
    default:
      if (messageId) {
        yield put(actions.sendMessage({
          messageId,
          type: 'actionFailed',
          payload: {
            error: {
              message: `Unsupported action: ${messageActionType}`
            }
          }
        }))
      }
      break
    }
  } catch (error) {
    if (messageId) {
      yield put(actions.sendMessage({
        messageId,
        type: 'actionFailed',
        payload: {
          error: {
            message: error.message || error
          }
        }
      }))
    }
  }
}

function* rejectMessage() {
  const messageId = yield select((state: RootState) => state.bridge.pendingMessage && state.bridge.pendingMessage.messageId)
  const resolving = yield select((state: RootState) => state.bridge.resolving)

  if (messageId && !resolving) {
    yield put(actions.clearMessage())
    // yield delay(500)
    yield put(actions.sendMessage({
      messageId,
      type: 'actionFailed',
      payload: {
        error: {
          code: -32603,
          message: 'User rejected provider access'
        }
      }
    }))
  }
}

function* resolveMessage(action: Action<any>) {
  const pendingMessage = yield select((state: RootState) => state.bridge.pendingMessage)
  if (!pendingMessage) return

  const messageId = pendingMessage.messageId
  const password = action.payload.password

  if (messageId) {
    try {
      const messageActionType = pendingMessage.type
      const info = pendingMessage.info

      switch (messageActionType) {
      case 'transferEOSAsset':
        yield resolveTransferEOSAsset(password, info, messageId)
        break
      case 'voteEOSProducers':
        yield resolveVoteEOSProducers(password, info, messageId)
        break
      case 'pushEOSAction':
        yield resolvePushEOSAction(password, info, messageId)
        break
      case 'eosAuthSign':
        yield resolveSignEOSData(password, info, messageId)
        break
      case 'requestSignature':
        yield resolveRequestSignature(password, info, messageId)
        break
      case 'requestArbitrarySignature':
        yield resolveRequestArbitrarySignature(password, info, messageId)
      case 'eth_rpc_request':
        {
          const method = pendingMessage.payload.method
          const params = pendingMessage.payload.params
          const info = pendingMessage.info
          if (method === 'personal_sign') {
            yield resolveETHPersonalSign(password, params, messageId)
          } else if (method === 'eth_sign') {
            yield resolveETHSign(password, params, messageId)
          } else if (method === 'eth_signTypedData') {
            yield resolveETHSignTypedData(password, params, messageId)
          } else if (method === 'eth_signTypedData_v3') {
            yield resolveETHSignTypedDataV3(password, params, messageId)
          } else if (method === 'eth_signTypedData_v4') {
            yield resolveETHSignTypedDataV4(password, params, messageId)
          } else if (method === 'eth_sendTransaction') {
            yield resolveETHSendTransaction(password, params, messageId, info)
          } else if (method === 'eth_signTransaction') {
            yield resolveETHSignTransaction(password, params, messageId, info)
          }
        }
        break
      default:
        break
      }
    } catch (error) {
      yield put(actions.sendMessage({
        messageId,
        type: 'actionFailed',
        payload: {
          error: {
            message: error.message
          }
        }
      }))

      yield put(actions.clearMessage())
    }
  }
}

export default function* bridgeSaga() {
  yield takeEvery(String(actions.receiveMessage), receiveMessage)
  yield takeEvery(String(actions.rejectMessage), rejectMessage)
  yield takeEvery(String(actions.resolveMessage), resolveMessage)
}
