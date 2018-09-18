import assert from 'assert'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/dappBrowser'
import { escapeJSONString, parseMessageId, typeOf, validateEOSActions } from 'utils'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { currenctWalletSelector } from 'selectors/wallet'
import {
  initEOS,
  transferEOSAsset,
  voteEOSProducers,
  pushEOSAction,
  eosAuthSign
} from 'core/eos'

let dappBrowser: any

function initDappBrowser(action: Action<any>) {
  dappBrowser = action.payload
}

function closeDappBrowser() {
  dappBrowser = null
}

function* pendTransferEOSAsset(messageActionType: string, payload: any, messageId: string) {
  const hasPendingMessage = yield select((state: RootState) => state.dappBrowser.get('hasPendingMessage'))

  if (hasPendingMessage) {
    const pendingMessageActionType = yield select((state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'type']))
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

  const precision = payload.precision
  const amount = (+payload.amount).toFixed(precision)
  const symbol = payload.symbol
  const contract = payload.contract
  const fromAccount = payload.from
  const toAccount = payload.to
  const memo = payload.memo
  const blockchain = 'EOS'

  yield put(actions.pendMessage({
    messageId,
    payload,
    type: messageActionType,
    info: {
      amount,
      symbol,
      contract,
      fromAccount,
      toAccount,
      memo,
      blockchain
    }
  }))
}

function* pendVoteEOSProducers(messageActionType: string, payload: any, messageId: string) {
  const hasPendingMessage = yield select((state: RootState) => state.dappBrowser.get('hasPendingMessage'))
  if (hasPendingMessage) {
    const pendingMessageActionType = yield select((state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'type']))
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

  const voter = payload.voter
  const producers = payload.producers
  const blockchain = 'EOS'

  yield put(actions.pendMessage({
    messageId,
    payload,
    type: messageActionType,
    info: {
      voter,
      producers,
      blockchain
    }
  }))
}

function* pendPushEOSAction(messageActionType: string, payload: any, messageId: string) {
  const hasPendingMessage = yield select((state: RootState) => state.dappBrowser.get('hasPendingMessage'))
  if (hasPendingMessage) {
    const pendingMessageActionType = yield select((state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'type']))
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

  const pushActions = payload.actions
  const blockchain = 'EOS'

  yield put(actions.pendMessage({
    messageId,
    payload,
    type: messageActionType,
    info: {
      blockchain,
      actions: pushActions
    }
  }))
}

function* pendSignEOSData(messageActionType: string, payload: any, messageId: string) {
  const hasPendingMessage = yield select((state: RootState) => state.dappBrowser.get('hasPendingMessage'))
  if (hasPendingMessage) {
    const pendingMessageActionType = yield select((state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'type']))
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

  const account = payload.account
  const publicKey = payload.publicKey
  const signData = payload.signData
  const blockchain = 'EOS'

  yield put(actions.pendMessage({
    messageId,
    payload,
    type: messageActionType,
    info: {
      account,
      publicKey,
      signData,
      blockchain
    }
  }))
}

function* resolveTransferEOSAsset(password: string, info: any, messageId: string) {
  try {
    const fromAccount = info.get('fromAccount')
    const toAccount = info.get('toAccount')
    const amount = info.get('amount')
    const symbol = info.get('symbol')
    const precision = info.get('precision')
    const memo = info.get('memo') || ''
    const contract = info.get('contract')
    // const permission = info.get('permission')
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const eosAccountName = yield select((state: RootState) => eosAccountNameSelector(state))
    assert(eosAccountName === fromAccount, `You don\'t have the authority of account ${fromAccount}`)
    const data = yield call(transferEOSAsset, {
      fromAccount,
      toAccount,
      amount,
      symbol,
      precision,
      memo,
      password,
      contract,
      permission
    })
    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data
      }
    }))
  } catch (error) {
    yield put(actions.clearMessage())
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

function* resolveVoteEOSProducers(password: string, info: any, messageId: string) {
  try {
    const voter = info.get('voter')
    const producers = info.get('producers').toJS()
    const proxy = info.get('proxy') || ''
    // const permission = info.get('permission')
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const eosAccountName = yield select((state: RootState) => eosAccountNameSelector(state))
    assert(eosAccountName === voter, `You don\'t have the authority of account ${voter}`)

    const data = yield call(voteEOSProducers, {
      eosAccountName,
      password,
      producers,
      proxy,
      permission
    })
    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data
      }
    }))
  } catch (error) {
    yield put(actions.clearMessage())
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

function* resolvePushEOSAction(password: string, info: any, messageId: string) {
  try {
    const pushActions = info.get('actions').toJS()
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const account = yield select((state: RootState) => eosAccountNameSelector(state))

    const data = yield call(pushEOSAction, {
      account,
      password,
      permission,
      actions: pushActions
    })
    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data
      }
    }))
  } catch (error) {
    yield put(actions.clearMessage())
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

function* resolveSignEOSData(password: string, info: any, messageId: string) {
  try {
    const account = info.get('account')
    const publicKey = info.get('publicKey')
    const signData = info.get('signData')

    const signedData = yield call(eosAuthSign, {
      account,
      password,
      publicKey,
      signData
    })
    yield put(actions.clearMessage())
    yield put(actions.sendMessage({
      messageId,
      type: 'actionSucceeded',
      payload: {
        data: { signedData }
      }
    }))
  } catch (error) {
    yield put(actions.clearMessage())
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

    switch (messageActionType) {
    case 'getCurrentWallet':
      {
        const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))

        if (currentWallet) {
          yield put(actions.sendMessage({
            messageId,
            type: 'actionSucceeded',
            payload: {
              data: currentWallet.toJS()
            }
          }))
        } else {
          yield put(actions.sendMessage({
            messageId,
            type: 'actionFailed',
            payload: {
              error: {
                message: 'No wallet in bitportal!'
              }
            }
          }))
        }
      }
      break
    case 'getAppInfo':
      {
        const appInfo = yield select((state: RootState) => state.appInfo)
        yield put(actions.sendMessage({
          messageId,
          type: 'actionSucceeded',
          payload: {
            data: appInfo.toJS()
          }
        }))
      }
      break
    case 'getEOSAccountInfo':
      {
        const account = payload.account
        const eos = yield call(initEOS, {})
        const data = yield call(eos.getAccount, account)
        yield put(actions.sendMessage({
          messageId,
          type: 'actionSucceeded',
          payload: {
            data
          }
        }))
      }
      break
    case 'getEOSCurrencyBalance':
      {
        const account = payload.account
        const contract = payload.contract
        const eos = yield call(initEOS, {})
        const data = yield call(eos.getCurrencyBalance, { account, code: contract })
        yield put(actions.sendMessage({
          messageId,
          type: 'actionSucceeded',
          payload: {
            data
          }
        }))
      }
      break
    case 'getEOSActions':
      {
        const account = payload.account
        const position = payload.position
        const offset = payload.offset
        const eos = yield call(initEOS, {})
        const data = yield call(eos.getActions, { offset, account_name: account, pos: position })
        yield put(actions.sendMessage({
          messageId,
          type: 'actionSucceeded',
          payload: {
            data
          }
        }))
      }
      break
    case 'getEOSTransaction':
      {
        const id = payload.id
        const eos = yield call(initEOS, {})
        const data = yield call(eos.getTransaction, { id })
        yield put(actions.sendMessage({
          messageId,
          type: 'actionSucceeded',
          payload: {
            data
          }
        }))
      }
      break
    case 'transferEOSAsset':
      {
        const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))
        assert(currentWallet, 'No wallet in BitPortal!')
        const amount = payload.amount
        assert(+amount === +amount, 'Invalid amount.')
        const precision = payload.precision
        assert(+precision === +precision && /^\d+$/.test(precision) && +precision >= 0, 'Invalid precision.')
        const fromAccount = payload.from
        assert(fromAccount === currentWallet.get('account'), 'Sender account is not in BitPortal.')
        yield pendTransferEOSAsset(messageActionType, payload, messageId)
      }
      break
    case 'voteEOSProducers':
      {
        const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))
        assert(currentWallet, 'No wallet in BitPortal!')
        const voter = payload.voter
        assert(voter === currentWallet.get('account'), 'Voter is not in BitPortal.')
        const producers = payload.producers
        assert(typeOf(producers) === 'Array', 'Invalid producers.')
        yield pendVoteEOSProducers(messageActionType, payload, messageId)
      }
      break
    case 'pushEOSAction':
      {
        const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))
        assert(currentWallet, 'No wallet in BitPortal!')
        const actions = payload.actions
        const errorMessage = validateEOSActions(actions, currentWallet.get('account'))
        assert(!errorMessage, errorMessage)
        yield pendPushEOSAction(messageActionType, payload, messageId)
      }
      break
    case 'eosAuthSign':
      {
        const currentWallet = yield select((state: RootState) => currenctWalletSelector(state))
        assert(currentWallet, 'No wallet in BitPortal!')
        const account = payload.account
        assert(account === currentWallet.get('account'), 'Account is not in BitPortal.')
        const publicKey = payload.publicKey
        assert(publicKey === currentWallet.get('publicKey'), 'Public key is not in BitPortal.')
        yield pendSignEOSData(messageActionType, payload, messageId)
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

function sendMessage(action: Action<any>) {
  if (dappBrowser) {
    dappBrowser.sendToBridge(
      escapeJSONString(
        JSON.stringify(action.payload)
      )
    )
  }
}

function* rejectMessage() {
  if (dappBrowser) {
    const messageId = yield select((state: RootState) => state.dappBrowser.getIn(['pendingMessage', 'messageId']))
    const resolving = yield select((state: RootState) => state.dappBrowser.get('resolving'))

    if (messageId && !resolving) {
      yield put(actions.clearMessage())
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
}

function* resolveMessage(action: Action<any>) {
  if (dappBrowser) {
    const pendingMessage = yield select((state: RootState) => state.dappBrowser.get('pendingMessage'))
    if (!pendingMessage) return

    const messageId = pendingMessage.get('messageId')
    const password = action.payload.password

    if (messageId) {
      try {
        const messageActionType = pendingMessage.get('type')
        const info = pendingMessage.get('info')

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
}

export default function* dappBrowserSaga() {
  yield takeEvery(String(actions.initDappBrowser), initDappBrowser)
  yield takeEvery(String(actions.closeDappBrowser), closeDappBrowser)
  yield takeEvery(String(actions.sendMessage), sendMessage)
  yield takeEvery(String(actions.receiveMessage), receiveMessage)
  yield takeEvery(String(actions.rejectMessage), rejectMessage)
  yield takeEvery(String(actions.resolveMessage), resolveMessage)
}
