import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, put, call, select } from 'redux-saga/effects'
import { getErrorMessage } from 'utils'
import { reset } from 'redux-form'
import secureStorage from 'core/storage/secureStorage'
import * as actions from 'actions/transaction'
import * as btcChain from 'core/chain/bitcoin'
import * as ethChain from 'core/chain/etheruem'
import * as eosChain from 'core/chain/eos'
import { push } from 'utils/location'

function* transfer(action: Action) {
  if (!action.payload) return

  try {
    const { chain, id, password, amount, symbol, precision, memo, contract, toAddress, fromAddress, feeRate } = action.payload

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    if (chain === 'ETHEREUM') {
      const hash = yield call(ethChain.transfer, password, keystore, fromAddress, toAddress, amount)
      const transaction = {
        id: hash,
        timestamp: +Date.now(),
        change: -+amount,
        blockNumber: '--',
        targetAddress: toAddress,
        from: fromAddress,
        to: toAddress,
        transactionType: 'send',
        confirmations: '--',
        gasUsed: '--',
        gasPrice: '--',
        pending: true
      }

      yield put(actions.addTransaction({ id: `${chain}/${fromAddress}`, item: transaction }))
      yield put(actions.setActiveTransactionId(hash))
    } else if (chain === 'BITCOIN') {
      const utxo = yield select((state: RootState) => state.utxo)
      const walletUTXO = utxo.byId[`${chain}/${fromAddress}`]
      assert(walletUTXO, 'No utxo')

      const address = yield select((state: RootState) => state.address)
      const walletAddress = address.byId[`${chain}/${fromAddress}`]
      assert(walletAddress, 'No address')

      const changeAddress = btcChain.getChangeAddress(walletUTXO, walletAddress.change)
      const { inputs, outputs, fee } = yield call(btcChain.selectUTXO, walletUTXO, amount, toAddress, changeAddress, feeRate)
      const inputsWithIdx = btcChain.getInputsWithIdx(inputs, walletAddress)
      const hash = yield call(btcChain.transfer, password, keystore, inputsWithIdx, outputs)

      const transaction = {
        id: hash,
        timestamp: +Date.now(),
        change: -+amount,
        blockheight: '--',
        targetAddress: toAddress,
        transactionType: 'send',
        confirmations: '--',
        fees: '--',
        vin: [{ addr: fromAddress }],
        vout: [{ scriptPubKey: { addresses: [toAddress] } }],
        pending: true
      }

      yield put(actions.addTransaction({ id: `${chain}/${fromAddress}`, item: transaction }))
      yield put(actions.setActiveTransactionId(hash))
    } else if (chain === 'EOS') {
      const allAccounts = yield select((state: RootState) => state.account)
      const account = allAccounts.byId[`${chain}/${fromAddress}`]
      assert(account, 'No eos account')
      const hash = yield call(eosChain.transfer, password, keystore, fromAddress, toAddress, amount, symbol, precision, memo, contract, account.permissions)
      const transaction = {
        action_trace: {
          act: {
            account: contract,
            data: {
              from: fromAddress,
              to: toAddress,
              memo: memo
            }
          }
        },
        id: hash,
        timestamp: +Date.now(),
        change: -+amount,
        block_num: '--',
        targetAddress: toAddress,
        transactionType: 'send',
        pending: true
      }

      yield put(actions.addTransaction({ id: `${chain}/${fromAddress}`, item: transaction }))
      yield put(actions.setActiveTransactionId(hash))
    }

    yield put(actions.transfer.succeeded())
    yield put(reset('transferAssetForm'))
    yield delay(500)

    if (action.payload.componentId) push(
      'BitPortal.TransactionDetail',
      action.payload.componentId,
      {
        chain: chain,
        precision: precision,
        symbol: symbol
      },
      {
        topBar: {
          title: {
            text: `${symbol} 转账中...`
          }
        }
      })
  } catch (e) {
    yield put(actions.transfer.failed(getErrorMessage(e)))
  }
}

function* getTransactions(action: Action) {
  if (!action.payload) return

  try {
    const chain = action.payload.chain
    const address = action.payload.address
    const walletId = action.payload.id

    let id = `${chain}/${address}`

    if (chain === 'BITCOIN') {
      const allAddresses = yield select((state: RootState) => state.address)
      const walletAddresses = allAddresses.byId[id]
      assert(walletAddresses, 'No hd wallet addresses')

      const fromIndex = 0
      const toIndex = 50
      const addresses = walletAddresses.external.allIds.concat(walletAddresses.change.allIds)
      const transactions = yield call(btcChain.getTransactions, addresses, fromIndex, toIndex)
      const items = transactions.items
        .map((item: any) => ({ ...item, id: item.txid, timestamp: +item.time * 1000 }))
        .map((item: any) => {
          const internalInput = []
          const externalInput = []
          item.vin.forEach((item: string) => {
            if (addresses.indexOf(item.addr) !== -1) {
              internalInput.push(item)
            } else {
              externalInput.push(item)
            }
          })

          const internalOutput = []
          const externalOutput = []
          item.vout.forEach((item: string) => {
            if (item.scriptPubKey && item.scriptPubKey.addresses && item.scriptPubKey.addresses.length) {
              const scriptPubKeyAddresses = item.scriptPubKey.addresses
              let hasInternalAddress = false

              for (let i = 0; i < scriptPubKeyAddresses.length; i++) {
                if (addresses.indexOf(scriptPubKeyAddresses[i]) !== -1) {
                  hasInternalAddress = true
                  break
                }
              }

              if (hasInternalAddress) {
                internalOutput.push(item)
              } else {
                externalOutput.push(item)
              }
            } else {
              externalOutput.push(item)
            }
          })

          const internalInputValue = internalInput.reduce((value: number, input: any) => +value + +input.value, 0)
          const externalInputValue = externalInput.reduce((value: number, input: any) => +value + +input.value, 0)
          const internalOutputValue = internalOutput.reduce((value: number, input: any) => +value + +input.value, 0)
          const externalOutputValue = externalOutput.reduce((value: number, input: any) => +value + +input.value, 0)
          const fees = item.fees
          const isSender = internalInputValue >= internalOutputValue + fees
          const transactionType = isSender ? 'send' : 'receive'
          const change = isSender ? +(+internalOutputValue + +fees - +internalInputValue).toFixed(8) : +(+internalOutputValue - +internalInputValue).toFixed(8)
          const targetAddress = isSender ? externalOutput[0].scriptPubKey.addresses[0] : externalInput[0].addr

          return { ...item, change, transactionType, targetAddress }
        }).reverse()

      const pagination = {
        totalItems: transactions.totalItems,
        from: transactions.from,
        to: transactions.to
      }

      yield put(actions.updateTransactions({ id, items, pagination }))
    } else if (chain === 'ETHEREUM') {
      const startblock = 0
      const endblock = 99999999
      const transactions = yield call(ethChain.getTransactions, address, startblock, endblock)
      const items = transactions.map((item: any) => {
        const isSender = item.from === address.toLowerCase()
        const transactionType = isSender ? 'send' : 'receive'
        const change = (isSender ? -+item.value : +item.value) * Math.pow(10, -18)
        const targetAddress = isSender ? item.to : item.from

        return {
          ...item,
          id: item.hash,
          timestamp: +item.timeStamp * 1000,
          change,
          targetAddress,
          transactionType
        }
      })

      const pagination = {
        totalItems: items.length,
        startblock,
        endblock
      }

      yield put(actions.updateTransactions({ id, items, pagination }))
    } else if (chain === 'EOS') {
      const position = 0
      const offset = 2000
      const transactions = yield call(eosChain.getTransactions, address, position, offset)
      const items = transactions.actions
        .filter((item: any) => item.action_trace.act.name === 'transfer' && item.action_trace.act.account === 'eosio.token')
        .map((item: any) => {
          const isSender = item.action_trace.act.data.from === address
          const transactionType = isSender ? 'send' : 'receive'
          const amount = item.action_trace.act.data.quantity.split(' ')[0]
          const change = isSender ? -+amount : +amount
          const targetAddress = isSender ? item.action_trace.act.data.to : item.action_trace.act.data.from

          return {
            ...item,
            id: item.action_trace.trx_id,
            timestamp: +new Date(item.block_time),
            change,
            targetAddress,
            transactionType
          }
        })

      const pagination = {
        last_irreversible_block: transactions.last_irreversible_block,
        position,
        offset
      }

      yield put(actions.updateTransactions({ id, items, pagination }))
    }

    yield put(actions.getTransactions.succeeded())
  } catch (e) {
    yield put(actions.getTransactions.failed(getErrorMessage(e)))
  }
}

function* getTransaction(action: Action) {
  if (!action.payload) return

  try {
    const chain = action.payload.chain
    const address = action.payload.address
    const walletId = action.payload.id
    const transactionId = action.payload.transactionId

    let id = `${chain}/${address}`

    if (chain === 'BITCOIN') {
      const transaction = yield call(btcChain.getTransaction, transactionId)
      console.log(transaction)
      // const items = transactions.items
      //   .map((item: any) => ({ ...item, id: item.txid, timestamp: +item.time * 1000 }))
      //   .map((item: any) => {
      //     const internalInput = []
      //     const externalInput = []
      //     item.vin.forEach((item: string) => {
      //       if (addresses.indexOf(item.addr) !== -1) {
      //         internalInput.push(item)
      //       } else {
      //         externalInput.push(item)
      //       }
      //     })

      //     const internalOutput = []
      //     const externalOutput = []
      //     item.vout.forEach((item: string) => {
      //       if (item.scriptPubKey && item.scriptPubKey.addresses && item.scriptPubKey.addresses.length) {
      //         const scriptPubKeyAddresses = item.scriptPubKey.addresses
      //         let hasInternalAddress = false

      //         for (let i = 0; i < scriptPubKeyAddresses.length; i++) {
      //           if (addresses.indexOf(scriptPubKeyAddresses[i]) !== -1) {
      //             hasInternalAddress = true
      //             break
      //           }
      //         }

      //         if (hasInternalAddress) {
      //           internalOutput.push(item)
      //         } else {
      //           externalOutput.push(item)
      //         }
      //       } else {
      //         externalOutput.push(item)
      //       }
      //     })

      //     const internalInputValue = internalInput.reduce((value: number, input: any) => +value + +input.value, 0)
      //     const externalInputValue = externalInput.reduce((value: number, input: any) => +value + +input.value, 0)
      //     const internalOutputValue = internalOutput.reduce((value: number, input: any) => +value + +input.value, 0)
      //     const externalOutputValue = externalOutput.reduce((value: number, input: any) => +value + +input.value, 0)
      //     const fees = item.fees
      //     const isSender = internalInputValue >= internalOutputValue + fees
      //     const transactionType = isSender ? 'send' : 'receive'
      //     const change = isSender ? +(+internalOutputValue + +fees - +internalInputValue).toFixed(8) : +(+internalOutputValue - +internalInputValue).toFixed(8)
      //     const targetAddress = isSender ? externalOutput[0].scriptPubKey.addresses[0] : externalInput[0].addr

      //     return { ...item, change, transactionType, targetAddress }
      //   }).reverse()


    } else if (chain === 'ETHEREUM') {
      // const item = yield call(ethChain.getTransaction, transactionId)
      // const isSender = item.from === address.toLowerCase()
      // const transactionType = isSender ? 'send' : 'receive'
      // const change = (isSender ? -+item.value : +item.value) * Math.pow(10, -18)
      // const targetAddress = isSender ? item.to : item.from

      // const tx = {
      //   ...item,
      //   id: item.hash,
      //   timestamp: +item.timeStamp * 1000,
      //   change,
      //   targetAddress,
      //   transactionType
      // }
      // yield put(actions.updateTransaction({ id, item: tx }))
    } else if (chain === 'EOS') {
      // const item = yield call(eosChain.getTransaction, transactionId)
      // item.action_trace = item.traces.find((item: any) => item.receipt.receiver === address)
      // if (item.action_trace) {
      //   const isSender = item.action_trace.act.data.from === address
      //   const transactionType = isSender ? 'send' : 'receive'
      //   const amount = item.action_trace.act.data.quantity.split(' ')[0]
      //   const change = isSender ? -+amount : +amount
      //   const targetAddress = isSender ? item.action_trace.act.data.to : item.action_trace.act.data.from

      //   const tx = {
      //     ...item,
      //     id: item.action_trace.trx_id,
      //     timestamp: +new Date(item.block_time),
      //     change,
      //     targetAddress,
      //     transactionType
      //   }
      //   yield put(actions.updateTransaction({ id, item: tx }))
      // }
    }

    yield put(actions.getTransaction.succeeded())
  } catch (e) {
    yield put(actions.getTransaction.failed(getErrorMessage(e)))
  }
}

export default function* transactionSaga() {
  yield takeLatest(String(actions.transfer.requested), transfer)
  yield takeLatest(String(actions.getTransactions.requested), getTransactions)
  yield takeLatest(String(actions.getTransactions.refresh), getTransactions)
  yield takeLatest(String(actions.getTransaction.requested), getTransaction)
  yield takeLatest(String(actions.getTransaction.refresh), getTransaction)
}
