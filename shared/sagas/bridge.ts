import assert from 'assert'
import { delay } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/bridge'
import { parseMessageId, typeOf, validateEOSActions } from 'utils'
import { activeAccountSelector } from 'selectors/account'
import { activeWalletSelector } from 'selectors/wallet'
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

function* pendTransferEOSAsset(messageActionType: string, payload: any, messageId: string) {
  // const hasPendingMessage = yield select((state: RootState) => state.dappBrowser.get('hasPendingMessage'))

  // if (hasPendingMessage) {
  //   const pendingMessageActionType = yield select((state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'type']))
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionFailed',
  //     payload: {
  //       error: {
  //         message: `There's a pending request: ${pendingMessageActionType}`
  //       }
  //     }
  //   }))
  //   return
  // }

  // const precision = payload.precision
  // const amount = (+payload.amount).toFixed(precision)
  // const symbol = payload.symbol
  // const contract = payload.contract
  // const fromAccount = payload.from
  // const toAccount = payload.to
  // const memo = payload.memo
  // const blockchain = 'EOS'

  // yield put(actions.pendMessage({
  //   messageId,
  //   payload,
  //   type: messageActionType,
  //   info: {
  //     amount,
  //     symbol,
  //     contract,
  //     fromAccount,
  //     toAccount,
  //     memo,
  //     blockchain
  //   }
  // }))
}

function* pendVoteEOSProducers(messageActionType: string, payload: any, messageId: string) {
  // const hasPendingMessage = yield select((state: RootState) => state.dappBrowser.get('hasPendingMessage'))
  // if (hasPendingMessage) {
  //   const pendingMessageActionType = yield select((state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'type']))
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionFailed',
  //     payload: {
  //       error: {
  //         message: `There's a pending request: ${pendingMessageActionType}`
  //       }
  //     }
  //   }))
  //   return
  // }

  // const voter = payload.voter
  // const producers = payload.producers
  // const blockchain = 'EOS'

  // yield put(actions.pendMessage({
  //   messageId,
  //   payload,
  //   type: messageActionType,
  //   info: {
  //     voter,
  //     producers,
  //     blockchain
  //   }
  // }))
}

function* pendPushEOSAction(messageActionType: string, payload: any, messageId: string) {
  // const hasPendingMessage = yield select((state: RootState) => state.dappBrowser.get('hasPendingMessage'))
  // if (hasPendingMessage) {
  //   const pendingMessageActionType = yield select((state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'type']))
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionFailed',
  //     payload: {
  //       error: {
  //         message: `There's a pending request: ${pendingMessageActionType}`
  //       }
  //     }
  //   }))
  //   return
  // }

  // const pushActions = payload.actions
  // const blockchain = 'EOS'

  // yield put(actions.pendMessage({
  //   messageId,
  //   payload,
  //   type: messageActionType,
  //   info: {
  //     blockchain,
  //     actions: pushActions
  //   }
  // }))
}

function* pendSignEOSData(messageActionType: string, payload: any, messageId: string) {
  // const hasPendingMessage = yield select((state: RootState) => state.dappBrowser.get('hasPendingMessage'))
  // if (hasPendingMessage) {
  //   const pendingMessageActionType = yield select((state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'type']))
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionFailed',
  //     payload: {
  //       error: {
  //         message: `There's a pending request: ${pendingMessageActionType}`
  //       }
  //     }
  //   }))
  //   return
  // }

  // const account = payload.account
  // const publicKey = payload.publicKey
  // const signData = payload.signData
  // const isHash = payload.isHash || false
  // const blockchain = 'EOS'

  // yield put(actions.pendMessage({
  //   messageId,
  //   payload,
  //   type: messageActionType,
  //   info: {
  //     account,
  //     publicKey,
  //     signData,
  //     isHash,
  //     blockchain
  //   }
  // }))
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
}

function* resolveTransferEOSAsset(password: string, info: any, messageId: string) {
  // try {
  //   const fromAccount = info.get('fromAccount')
  //   const toAccount = info.get('toAccount')
  //   const amount = info.get('amount')
  //   const symbol = info.get('symbol')
  //   const precision = info.get('precision')
  //   const memo = info.get('memo') || ''
  //   const contract = info.get('contract')
  //   // const permission = info.get('permission')
  //   const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
  //   const eosAccountName = yield select((state: RootState) => eosAccountNameSelector(state))
  //   assert(eosAccountName === fromAccount, `You don\'t have the authority of account ${fromAccount}`)
  //   const data = yield call(transferEOSAsset, {
  //     fromAccount,
  //     toAccount,
  //     amount,
  //     symbol,
  //     precision,
  //     memo,
  //     password,
  //     contract,
  //     permission
  //   })
  //   yield put(actions.clearMessage())
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionSucceeded',
  //     payload: {
  //       data
  //     }
  //   }))
  // } catch (error) {
  //   yield put(actions.clearMessage())
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionFailed',
  //     payload: {
  //       error: {
  //         message: error.message || error
  //       }
  //     }
  //   }))
  // }
}

function* resolveVoteEOSProducers(password: string, info: any, messageId: string) {
  // try {
  //   const voter = info.get('voter')
  //   const producers = info.get('producers').toJS()
  //   const proxy = info.get('proxy') || ''
  //   // const permission = info.get('permission')
  //   const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
  //   const eosAccountName = yield select((state: RootState) => eosAccountNameSelector(state))
  //   assert(eosAccountName === voter, `You don\'t have the authority of account ${voter}`)

  //   const data = yield call(voteEOSProducers, {
  //     eosAccountName,
  //     password,
  //     producers,
  //     proxy,
  //     permission
  //   })
  //   yield put(actions.clearMessage())
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionSucceeded',
  //     payload: {
  //       data
  //     }
  //   }))
  // } catch (error) {
  //   yield put(actions.clearMessage())
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionFailed',
  //     payload: {
  //       error: {
  //         message: error.message || error
  //       }
  //     }
  //   }))
  // }
}

function* resolvePushEOSAction(password: string, info: any, messageId: string) {
  // try {
  //   const pushActions = info.get('actions').toJS()
  //   const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
  //   const account = yield select((state: RootState) => eosAccountNameSelector(state))

  //   const data = yield call(pushEOSAction, {
  //     account,
  //     password,
  //     permission,
  //     actions: pushActions
  //   })
  //   yield put(actions.clearMessage())
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionSucceeded',
  //     payload: {
  //       data
  //     }
  //   }))
  // } catch (error) {
  //   yield put(actions.clearMessage())
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionFailed',
  //     payload: {
  //       error: {
  //         message: error.message || error
  //       }
  //     }
  //   }))
  // }
}

function* resolveSignEOSData(password: string, info: any, messageId: string) {
  // try {
  //   const account = info.get('account')
  //   const publicKey = info.get('publicKey')
  //   const signData = info.get('signData')
  //   const isHash = info.get('isHash')

  //   const signedData = yield call(eosAuthSign, {
  //     account,
  //     password,
  //     publicKey,
  //     signData,
  //     isHash
  //   })
  //   yield put(actions.clearMessage())
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionSucceeded',
  //     payload: {
  //       data: signedData
  //     }
  //   }))
  // } catch (error) {
  //   yield put(actions.clearMessage())
  //   yield put(actions.sendMessage({
  //     messageId,
  //     type: 'actionFailed',
  //     payload: {
  //       error: {
  //         message: error.message || error
  //       }
  //     }
  //   }))
  // }
}

function* resolveRequestSignature(password: string, info: any, messageId: string) {
  try {
    const buf = info.buf
    const permission = [...new Set(info.transaction.actions.map((action: any) => action.authorization.map((auth: any) => auth.permission)).flat())][0]
    const wallet = yield select((state: RootState) => activeWalletSelector(state))
    const account = yield select((state: RootState) => activeAccountSelector(state))
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
    const wallet = yield select((state: RootState) => activeWalletSelector(state))
    const account = yield select((state: RootState) => activeAccountSelector(state))
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
    console.log(action)

    switch (messageActionType) {
    // case 'getCurrentWallet':
    //   {
    //     const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))

    //     if (currentWallet) {
    //       yield put(actions.sendMessage({
    //         messageId,
    //         type: 'actionSucceeded',
    //         payload: {
    //           data: currentWallet.toJS()
    //         }
    //       }))
    //     } else {
    //       yield put(actions.sendMessage({
    //         messageId,
    //         type: 'actionFailed',
    //         payload: {
    //           error: {
    //             message: 'No wallet in bitportal!'
    //           }
    //         }
    //       }))
    //     }
    //   }
    //   break
    // case 'getAppInfo':
    //   {
    //     const appInfo = yield select((state: RootState) => state.appInfo)
    //     yield put(actions.sendMessage({
    //       messageId,
    //       type: 'actionSucceeded',
    //       payload: {
    //         data: appInfo.toJS()
    //       }
    //     }))
    //   }
    //   break
    // case 'getEOSAccountInfo':
    //   {
    //     const account = payload.account
    //     const eos = yield call(initEOS, {})
    //     const data = yield call(eos.getAccount, account)
    //     yield put(actions.sendMessage({
    //       messageId,
    //       type: 'actionSucceeded',
    //       payload: {
    //         data
    //       }
    //     }))
    //   }
    //   break
    // case 'getEOSCurrencyBalance':
    //   {
    //     const account = payload.account
    //     const contract = payload.contract
    //     const eos = yield call(initEOS, {})
    //     const data = yield call(eos.getCurrencyBalance, { account, code: contract })
    //     yield put(actions.sendMessage({
    //       messageId,
    //       type: 'actionSucceeded',
    //       payload: {
    //         data
    //       }
    //     }))
    //   }
    //   break
    // case 'getEOSActions':
    //   {
    //     const account = payload.account
    //     const position = payload.position
    //     const offset = payload.offset
    //     const eos = yield call(initEOS, {})
    //     const data = yield call(eos.getActions, { offset, account_name: account, pos: position })
    //     yield put(actions.sendMessage({
    //       messageId,
    //       type: 'actionSucceeded',
    //       payload: {
    //         data
    //       }
    //     }))
    //   }
    //   break
    // case 'getEOSTransaction':
    //   {
    //     const id = payload.id
    //     const eos = yield call(initEOS, {})
    //     const data = yield call(eos.getTransaction, { id })
    //     yield put(actions.sendMessage({
    //       messageId,
    //       type: 'actionSucceeded',
    //       payload: {
    //         data
    //       }
    //     }))
    //   }
    //   break
    // case 'transferEOSAsset':
    //   {
    //     const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))
    //     assert(currentWallet, 'No wallet in BitPortal!')
    //     const amount = payload.amount
    //     assert(+amount === +amount, 'Invalid amount.')
    //     const precision = payload.precision
    //     assert(+precision === +precision && /^\d+$/.test(precision) && +precision >= 0, 'Invalid precision.')
    //     const fromAccount = payload.from
    //     assert(fromAccount === currentWallet.get('account'), 'Sender account is not in BitPortal.')
    //     yield pendTransferEOSAsset(messageActionType, payload, messageId)
    //   }
    //   break
    // case 'voteEOSProducers':
    //   {
    //     const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))
    //     assert(currentWallet, 'No wallet in BitPortal!')
    //     const voter = payload.voter
    //     assert(voter === currentWallet.get('account'), 'Voter is not in BitPortal.')
    //     const producers = payload.producers
    //     assert(typeOf(producers) === 'Array', 'Invalid producers.')
    //     yield pendVoteEOSProducers(messageActionType, payload, messageId)
    //   }
    //   break
    // case 'pushEOSAction':
    //   {
    //     const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))
    //     assert(currentWallet, 'No wallet in BitPortal!')
    //     const actions = payload.actions
    //     const errorMessage = validateEOSActions(actions, currentWallet.get('account'))
    //     assert(!errorMessage, errorMessage)
    //     yield pendPushEOSAction(messageActionType, payload, messageId)
    //   }
    //   break
    // case 'eosAuthSign':
    //   {
    //     const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))
    //     assert(currentWallet, 'No wallet in BitPortal!')
    //     const account = payload.account
    //     assert(account === currentWallet.get('account'), 'Account is not in BitPortal.')
    //     const publicKey = payload.publicKey
    //     assert(publicKey === currentWallet.get('publicKey'), 'Public key is not in BitPortal.')
    //     yield pendSignEOSData(messageActionType, payload, messageId)
    //   }
    //   break
    case 'getOrRequestIdentity':
      {
        const activeWallet = yield select((state: RootState) => activeWalletSelector(state))
        assert(activeWallet && activeWallet.chain === 'EOS', 'No active EOS wallet in BitPortal!')
        const activeAccount = yield select((state: RootState) => activeAccountSelector(state))
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
        const activeWallet = yield select((state: RootState) => activeWalletSelector(state))
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
        const activeWallet = yield select((state: RootState) => activeWalletSelector(state))
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

        const activeAccount = yield select((state: RootState) => activeAccountSelector(state))
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
        const activeWallet = yield select((state: RootState) => activeWalletSelector(state))
        assert(activeWallet && activeWallet.chain === 'EOS' && !!activeWallet.address, 'No active EOS wallet in BitPortal!')

        const activeAccount = yield select((state: RootState) => activeAccountSelector(state))
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
        const activeWallet = yield select((state: RootState) => activeWalletSelector(state))
        assert(activeWallet && activeWallet.chain === 'EOS' && !!activeWallet.address, 'No active EOS wallet in BitPortal!')

        const activeAccount = yield select((state: RootState) => activeAccountSelector(state))
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
    yield delay(500)
    yield put(actions.sendMessage({
      messageId,
      type: 'actionFailed',
      payload: {
        error: {
          message: 'Action is canceled.'
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
