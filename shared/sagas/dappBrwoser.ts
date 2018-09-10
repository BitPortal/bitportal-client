import assert from 'assert'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/dappBrowser'
import { escapeJSONString, parseMessageId } from 'utils'
import { eosAccountNameSelector } from 'selectors/eosAccount'
import { initEOS } from 'core/eos'
import { getEOSWifsByInfo } from 'core/key'
import secureStorage from 'utils/secureStorage'

let dappBrowser: any

function initDappBrowser(action: Action<any>) {
  dappBrowser = action.payload
}

function closeDappBrowser() {
  dappBrowser = null
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
    case 'getEOSAccountInfo':
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
      break
    case 'transferEOSAsset':
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
            message: error.message
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

    if (messageId) {
      yield put(actions.sendMessage({
        messageId,
        type: 'actionFailed',
        payload: {
          error: {
            message: 'User canceled the action'
          }
        }
      }))
    }

    yield put(actions.clearMessage())
  }
}

function* resolveMessage(action: Action<any>) {
  if (dappBrowser) {
    const pendingMessage = yield select((state: RootState) => state.dappBrowser.get('pendingMessage'))
    const messageId = pendingMessage.get('messageId')
    const password = action.payload.password

    if (messageId) {
      try {
        const messageActionType = pendingMessage.get('type')
        const info = pendingMessage.get('info')

        switch (messageActionType) {
        case 'transferEOSAsset':
          const fromAccount = info.get('fromAccount')
          const toAccount = info.get('toAccount')
          const amount = info.get('amount')
          const symbol = info.get('symbol')
          const quantity = `${(+amount).toFixed(4)} ${symbol}`
          const memo = info.get('memo') || ''
          const contract = info.get('contract')
          const eosAccountName = yield select((state: RootState) => eosAccountNameSelector(state))
          assert(eosAccountName === fromAccount, `You don\'t have the authority of account ${fromAccount}`)
          const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${fromAccount}`, true)
          const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
          const wifs = yield call(getEOSWifsByInfo, password, accountInfo, [permission])
          const keyProvider = wifs.map((item: any) => item.wif)
          const eos = yield call(initEOS, { keyProvider })
          const contractAccount = yield call(eos.contract, contract)
          const data = yield call(contractAccount.transfer, { quantity, memo, from: fromAccount, to: toAccount })
          yield put(actions.sendMessage({
            messageId,
            type: 'actionSucceeded',
            payload: {
              data
            }
          }))
          yield put(actions.clearMessage())
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
