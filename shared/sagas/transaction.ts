import assert from 'assert'
import { delay } from 'redux-saga'
import { takeLatest, put, call, select, race } from 'redux-saga/effects'
import { getErrorMessage, getEOSErrorMessage } from 'utils'
import { reset } from 'redux-form'
import secureStorage from 'core/storage/secureStorage'
import * as actions from 'actions/transaction'
import { getAccount } from 'actions/account'
import { getBalance } from 'actions/balance'
import * as btcChain from 'core/chain/bitcoin'
import * as ethChain from 'core/chain/etheruem'
import * as eosChain from 'core/chain/eos'
import * as chainxChain from 'core/chain/chainx'
import * as rioChain from 'core/chain/polkadot'
import * as walletCore from 'core/wallet'

import * as api from 'utils/api'
import { managingWalletSelector } from 'selectors/wallet'
import { activeWalletTransactionsPaginationSelector } from 'selectors/transaction'
import { push, dismissAllModals } from 'utils/location'
import { timeoutInterval } from 'constants/chain'

function* transfer(action: Action) {
  if (!action.payload) return

  try {
    const { chain, source, id, password, amount, symbol, precision, decimals, memo, contract, toAddress, fromAddress, feeRate, gasLimit, gasPrice, opreturn } = action.payload

    const assetId = contract ? `${contract}/${symbol}` : 'syscoin'
    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    if (chain === 'ETHEREUM') {
      let hash
      if (contract) {
        const { result, timeout } = yield race({
          result: call(ethChain.transferToken, password, keystore, fromAddress, toAddress, contract, amount, decimals, gasPrice * Math.pow(10, 9), gasLimit),
          timeout: delay(timeoutInterval)
        })

        assert(!timeout, 'request timeout')
        hash = result
      } else {
        const { result, timeout } = yield race({
          result: call(ethChain.transfer, password, keystore, fromAddress, toAddress, amount, gasPrice * Math.pow(10, 9), gasLimit),
          timeout: delay(timeoutInterval)
        })

        assert(!timeout, 'request timeout')
        hash = result
      }

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

      yield put(actions.addTransaction({ id: `${chain}/${fromAddress}`, item: transaction, assetId }))
      yield put(actions.setActiveTransactionId(hash))
    } else if (chain === 'BITCOIN') {
      const utxo = yield select((state: RootState) => state.utxo)
      const walletUTXO = utxo.byId[`${chain}/${fromAddress}`]
      assert(walletUTXO, 'No utxo')

      let hash
      if (source === 'WIF') {
        const changeAddress = fromAddress
        const { inputs, outputs, fee } = yield call(btcChain.selectUTXO, walletUTXO, amount, toAddress, changeAddress, feeRate)

        const { result, timeout } = yield race({
          result: call(btcChain.transferByWif, password, keystore, inputs, outputs, opreturn),
          timeout: delay(timeoutInterval)
        })

        assert(!timeout, 'request timeout')
        hash = result
      } else {
        const address = yield select((state: RootState) => state.address)
        const walletAddress = address.byId[`${chain}/${fromAddress}`]
        assert(walletAddress, 'No address')

        const changeAddress = btcChain.getChangeAddress(walletUTXO, walletAddress.change)
        const { inputs, outputs, fee } = yield call(btcChain.selectUTXO, walletUTXO, amount, toAddress, changeAddress, feeRate)
        const inputsWithIdx = btcChain.getInputsWithIdx(inputs, walletAddress)
        console.log('select inputsWithIdx', inputsWithIdx)

        const { result, timeout } = yield race({
          result: call(btcChain.transfer, password, keystore, inputsWithIdx, outputs, opreturn),
          timeout: delay(timeoutInterval)
        })
        console.log('result transfer', result)

        assert(!timeout, 'request timeout')
        hash = result
      }

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
        vout: [{ scriptPubKey: { addresses: [toAddress] } }, ...(!!opreturn ? [{ scriptPubKey: { hex: opreturn } }] : [])],
        pending: true
      }

      yield put(actions.addTransaction({ id: `${chain}/${fromAddress}`, item: transaction, assetId }))
      yield put(actions.setActiveTransactionId(hash))
    } else if (chain === 'EOS') {
      const allAccounts = yield select((state: RootState) => state.account)
      const account = allAccounts.byId[`${chain}/${fromAddress}`]
      assert(account, 'No eos account')

      const { result, timeout } = yield race({
        result: call(eosChain.transfer, password, keystore, fromAddress, toAddress, amount, symbol, precision, memo, contract || 'eosio.token', account.permissions),
        timeout: delay(timeoutInterval)
      })

      assert(!timeout, 'request timeout')
      const hash = result

      const transaction = {
        id: hash,
        trx_id: hash,
        timestamp: +Date.now(),
        change: -+amount,
        block_num: '--',
        targetAddress: toAddress,
        transactionType: 'send',
        symbol,
        memo,
        sender: fromAddress,
        receiver: toAddress,
        code: contract || 'eosio.token',
        pending: true
      }

      yield put(actions.addTransaction({ id: `${chain}/${fromAddress}`, item: transaction, assetId }))
      yield put(actions.setActiveTransactionId(hash))
    } else if (chain === 'CHAINX') {
      let hash = ''

      if (memo) {
        const { result, timeout } = yield race({
          result: call(chainxChain.transfer, password, keystore, fromAddress, toAddress, symbol, precision, amount, memo),
          timeout: delay(timeoutInterval)
        })

        assert(!timeout, 'request timeout')
        hash = result
      } else {
        const { result, timeout } = yield race({
          result: call(chainxChain.transfer, password, keystore, fromAddress, toAddress, symbol, precision, amount, memo),
          timeout: delay(timeoutInterval)
        })

        assert(!timeout, 'request timeout')
        hash = result
      }

      const transaction = {
        id: hash,
        timestamp: +Date.now(),
        change: -+amount,
        blockNumber: '--',
        targetAddress: toAddress,
        from: fromAddress,
        to: toAddress,
        memo,
        transactionType: 'send',
        confirmations: '--',
        gasUsed: '--',
        gasPrice: '--',
        pending: true
      }

      yield put(actions.addTransaction({ id: `${chain}/${fromAddress}`, item: transaction, assetId }))
      yield put(actions.setActiveTransactionId(hash))
    }else if (chain === 'POLKADOT') {

      let hash = ''  

      const sender = yield call(walletCore.exportRioChainKeyPair, password, keystore)

      const { result, timeout } = yield race({
        result: call(rioChain.rioTransfer, {
          sender,
          receiver: toAddress,
          amount,
          decimals,
          assetId:contract,
         }),
        timeout: delay(timeoutInterval)
      })

      assert(!timeout, 'request timeout')
      hash = result || ''

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

      yield put(actions.addTransaction({ id: `${chain}/${fromAddress}`, item: transaction, assetId }))
      yield put(actions.setActiveTransactionId(hash))
    }

    yield put(actions.transfer.succeeded())
    yield put(reset('transferAssetForm'))
    yield delay(500)

    if (action.payload.componentId) {
      push(
        'BitPortal.TransactionDetail',
        action.payload.componentId,
        {
          chain: chain,
          precision: precision || 8,
          symbol: symbol
        },
        {
          topBar: {
            title: {
              text: `${symbol} 转账中...`
            }
          }
        })
    }
  } catch (e) {
    yield put(actions.transfer.failed(getErrorMessage(e)))
  }
}

function* vote(action: Action) {
  if (!action.payload) return

  try {
    const { chain, id, accountName, password, producers, proxy } = action.payload

    yield delay(500)
    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    assert(chain === 'EOS', 'Invalid chain type')

    const allAccounts = yield select((state: RootState) => state.account)
    const account = allAccounts.byId[`${chain}/${accountName}`]
    assert(account, 'No eos account')
    const sortedProducers = producers.slice().sort(eosChain.sortProducers)
    yield call(eosChain.vote, password, keystore, accountName, sortedProducers, proxy, account.permissions)

    yield put(actions.vote.succeeded())
    yield put(getAccount.requested({ chain, address: accountName }))
  } catch (e) {
    yield put(actions.vote.failed(getErrorMessage(e)))
  }
}

function* buyRAM(action: Action) {
  if (!action.payload) return

  try {
    const { chain, id, accountName, password, receiver, ramAmount } = action.payload

    yield delay(500)
    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    assert(chain === 'EOS', 'Invalid chain type')

    const allAccounts = yield select((state: RootState) => state.account)
    const account = allAccounts.byId[`${chain}/${accountName}`]
    assert(account, 'No eos account')

    const amount = `${(+ramAmount).toFixed(4)} EOS`
    yield call(eosChain.buyRAM, password, keystore, accountName, receiver || accountName, amount, account.permissions)

    yield put(actions.buyRAM.succeeded())
    yield put(reset('manageEOSResourcesForm'))
    yield put(reset('tradeEOSRAMForm'))
    yield put(getAccount.requested({ chain, address: accountName }))

    const managingWallet = yield select((state: RootState) => managingWalletSelector(state))
    yield put(getBalance.requested(managingWallet))
  } catch (e) {
    yield put(actions.buyRAM.failed(getEOSErrorMessage(e)))
  }
}

function* sellRAM(action: Action) {
  if (!action.payload) return

  try {
    const { chain, id, accountName, password, receiver, ramAmount } = action.payload

    yield delay(500)
    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    assert(chain === 'EOS', 'Invalid chain type')

    const allAccounts = yield select((state: RootState) => state.account)
    const account = allAccounts.byId[`${chain}/${accountName}`]
    assert(account, 'No eos account')

    const amount = +ramAmount
    yield call(eosChain.sellRAM, password, keystore, accountName, receiver || accountName, amount, account.permissions)

    yield put(actions.sellRAM.succeeded())
    yield put(reset('manageEOSResourcesForm'))
    yield put(reset('tradeEOSRAMForm'))
    yield put(getAccount.requested({ chain, address: accountName }))

    const managingWallet = yield select((state: RootState) => managingWalletSelector(state))
    yield put(getBalance.requested(managingWallet))
  } catch (e) {
    yield put(actions.sellRAM.failed(getErrorMessage(e)))
  }
}

function* delegateBW(action: Action) {
  if (!action.payload) return

  try {
    const { chain, id, accountName, password, receiver, cpuAmount, netAmount } = action.payload

    yield delay(500)
    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    assert(chain === 'EOS', 'Invalid chain type')

    const allAccounts = yield select((state: RootState) => state.account)
    const account = allAccounts.byId[`${chain}/${accountName}`]
    assert(account, 'No eos account')

    yield call(eosChain.delagateBW, password, keystore, accountName, receiver || accountName, `${(+cpuAmount).toFixed(4)} EOS`, `${(+netAmount).toFixed(4)} EOS`, account.permissions)

    yield put(actions.delegateBW.succeeded())
    yield put(reset('manageEOSResourcesForm'))
    yield put(reset('tradeEOSBandWidthForm'))
    yield put(getAccount.requested({ chain, address: accountName }))

    const managingWallet = yield select((state: RootState) => managingWalletSelector(state))
    yield put(getBalance.requested(managingWallet))
  } catch (e) {
    yield put(actions.delegateBW.failed(getErrorMessage(e)))
  }
}

function* undelegateBW(action: Action) {
  if (!action.payload) return

  try {
    const { chain, id, accountName, password, receiver, cpuAmount, netAmount } = action.payload

    yield delay(500)
    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    assert(chain === 'EOS', 'Invalid chain type')

    const allAccounts = yield select((state: RootState) => state.account)
    const account = allAccounts.byId[`${chain}/${accountName}`]
    assert(account, 'No eos account')

    yield call(eosChain.undelagateBW, password, keystore, accountName, receiver || accountName, `${(+cpuAmount).toFixed(4)} EOS`, `${(+netAmount).toFixed(4)} EOS`, account.permissions)

    yield put(actions.undelegateBW.succeeded())
    yield put(reset('manageEOSResourcesForm'))
    yield put(reset('tradeEOSBandWidthForm'))
    yield put(getAccount.requested({ chain, address: accountName }))

    const managingWallet = yield select((state: RootState) => managingWalletSelector(state))
    yield put(getBalance.requested(managingWallet))
  } catch (e) {
    yield put(actions.undelegateBW.failed(getErrorMessage(e)))
  }
}

function* getTransactions(action: Action) {
  if (!action.payload) return

  try {
    const chain = action.payload.chain
    const address = action.payload.address
    const source = action.payload.source
    const contract = action.payload.contract
    const symbol = action.payload.symbol
    const assetSymbol = action.payload.assetSymbol
    const walletId = action.payload.id
    const loadMore = action.payload.loadMore
    const assetId = contract ? `${contract}/${assetSymbol}` : 'syscoin'
    let id = `${chain}/${address}`

    if (loadMore) yield put(actions.setLoadingMore({ id, assetId, loadingMore: true }))

    if (chain === 'BITCOIN') {
      let addresses

      if (source === 'WIF') {
        addresses = [address]
      } else {
        const allAddresses = yield select((state: RootState) => state.address)
        const walletAddresses = allAddresses.byId[id]
        assert(walletAddresses, 'No hd wallet addresses')
        addresses = walletAddresses.external.allIds.concat(walletAddresses.change.allIds)
      }

      let fromIndex = 0
      let toIndex = 20

      if (loadMore) {
        const pagination = yield select(state => activeWalletTransactionsPaginationSelector(state))

        if (pagination && pagination.to && pagination.pageSize) {
          fromIndex = pagination.to
          toIndex = pagination.pageSize + fromIndex
        }
      }

      const transactions = yield call(btcChain.getTransactions, addresses, fromIndex, toIndex)
      const canLoadMore = transactions.totalItems !== transactions.items.length && transactions.items.length === 20
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
          let targetAddress = ''
          // Todo:: handle more complex situations
          if (isSender) {
            // if no external output value, then it is internal transfer
            const isInternalTransfer = (externalOutputValue === 0)
            targetAddress = isInternalTransfer ? internalOutput[0].scriptPubKey.addresses[0] : externalOutput[0].scriptPubKey.addresses[0]
          } else {
            targetAddress = externalInput[0].addr
          }

          return { ...item, change, transactionType, targetAddress }
        }).reverse()

      const pagination = {
        totalItems: transactions.totalItems,
        from: transactions.from,
        to: transactions.to,
        pageSize: 20
      }

      if (loadMore) {
        yield put(actions.updateTransactions({ id, items, pagination, assetId, canLoadMore, loadingMore: false }))
      } else {
        yield put(actions.addTransactions({ id, items, pagination, assetId, canLoadMore, loadingMore: false }))
      }
    } else if (chain === 'ETHEREUM') {
      console.log('getTransactions ethereum')
      const startblock = 0
      const endblock = 99999999

      let page = 1
      let offset = 20

      if (loadMore) {
        const pagination = yield select(state => activeWalletTransactionsPaginationSelector(state))

        if (pagination && pagination.page) {
          page = pagination.page + 1
        }
      }

      const transactions = yield call(ethChain.getTransactions, address, startblock, endblock, page, offset, contract)

      const canLoadMore = transactions.length === 20
      const items = transactions.map((item: any) => {
        let decimals = 18
        if (item && item.tokenDecimal) {
          decimals = +(item && item.tokenDecimal)
        }

        const isSender = item.from === address.toLowerCase()
        const transactionType = isSender ? 'send' : 'receive'
        const change = (isSender ? -+item.value : +item.value) * Math.pow(10, -decimals)
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
        startblock,
        endblock,
        page,
        offset
      }

      if (loadMore) {
        yield put(actions.updateTransactions({ id, items, pagination, assetId, canLoadMore, loadingMore: false }))
      } else {
        yield put(actions.addTransactions({ id, items, pagination, assetId, canLoadMore, loadingMore: false }))
      }
    } else if (chain === 'EOS') {
      let totalItems = 0
      let page = 1
      const pageSize = 100

      if (loadMore) {
        const pagination = yield select(state => activeWalletTransactionsPaginationSelector(state))

        if (pagination && pagination.page) {
          page = pagination.page + 1
        }

        if (pagination && pagination.totalItems) {
          totalItems = pagination.totalItems
        }
      } else {
        const transactions = yield call(eosChain.getTransactions, address, -1, -1)
        if (transactions.actions) {
          totalItems = transactions.actions[0].account_action_seq + 1
        }
      }

      // console.log('transaction totalitems', totalItems)
      const position = totalItems - (page - 1) * pageSize
      const tokenAccount = contract || 'eosio.token'
      const symbol = symbol || assetSymbol
      // const transactions = yield call(api.getEOSTransactions, { account_name: address, code: tokenAccount, symbol, type: 3, sort: 1, page, size: pageSize })
      // ?start_block=0&block_count=10000&limit=10&sort=desc&q=receiver:eosio.token+action:transfer+data.to:someaccount1
      const transactions = yield call(eosChain.getTransactions, address, position, -pageSize)
      // console.log('eos transactions', transactions)
      let transactionResult
      if (transactions.actions) {
        transactionResult = transactions.actions
          .filter(action => action && action.action_trace && action.action_trace.act && action.action_trace.act.name === 'transfer' && action.action_trace.act.account === tokenAccount)
          .map(action => {
            const blockNum = action.block_num
            const blockTime = action.block_time
            const id = action.action_trace.trx_id
            const data = action.action_trace.act.data
            const account = action.action_trace.act.account
            return { blockNum, data, account, id, blockTime }
          })
      } else {
        transactionResult = []
      }

      const items = transactionResult.map((item: any) => {
        const sender = item.data.from
        const receiver = item.data.to
        const memo = item.data.memo
        const block_num = item.blockNum
        const code = item.account
        const status = item.status
        const isSender = item.data.from === address
        const transactionType = isSender ? 'send' : 'receive'
        const amount = item.data.quantity && item.data.quantity.split(' ')[0]
        const symbol = item.data.quantity && item.data.quantity.split(' ')[1]
        const change = isSender ? -+amount : +amount
        const targetAddress = isSender ? item.data.to : item.data.from

        return {
            ...item,
          id: item.id,
          timestamp: +new Date(item.blockTime),
          change,
          amount,
          symbol,
          sender,
          receiver,
          memo,
          block_num,
          code,
          status,
          targetAddress,
          transactionType
        }
      })

      // const totalItems = transactions.total
      const pagination = {
        page,
        pageSize,
        totalItems
      }

      if (loadMore) {
        yield put(actions.updateTransactions({ id, items, pagination, assetId, canLoadMore: totalItems > (+page) * (+pageSize), loadingMore: false }))
      } else {
        yield put(actions.addTransactions({ id, items, pagination, assetId, canLoadMore: totalItems > (+page) * (+pageSize), loadingMore: false }))
      }

      if (!items.length && page * pageSize < totalItems) {
        yield put(actions.getTransactions.requested({ ...action.payload, loadMore: true }))
      }
    } else if (chain === 'CHAINX') {
      const page = 0
      const pageSize = 200
      const transactions = yield call(chainxChain.getTransactions, address, page, pageSize)
      const items = transactions.items.map((item: any) => {
        // TODO: this need to be fixed
        const isTransfer = item.module === 'XAssets' && item.call === 'transfer'
        const isDest = isTransfer && item.args[0].data === address
        const transactionType = item.module + '.' + item.call
        const change = (isDest ? +item.args[1].data : -+item.args[1].data) * Math.pow(10, -8)
        const targetAddress = isDest ? item.args[0].data : item.args[0].data

        return {
          ...item,
          id: item.hash,
          timestamp: +item.time,
          change,
          targetAddress,
          transactionType
        }
      })

      const pagination = {
        transactions: items.total,
        page,
        pageSize
      }

      yield put(actions.updateTransactions({ id, items, pagination, assetId }))
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
    const source = action.payload.source
    const contract = action.payload.contract
    const assetSymbol = action.payload.assetSymbol
    const walletId = action.payload.id
    const transactionId = action.payload.transactionId
    const assetId = contract ? `${contract}/${assetSymbol}` : 'syscoin'

    let id = `${chain}/${address}`

    if (chain === 'BITCOIN') {
      // let addresses

      // if (source === 'WIF') {
      //   addresses = [address]
      // } else {
      //   const allAddresses = yield select((state: RootState) => state.address)
      //   const walletAddresses = allAddresses.byId[id]
      //   assert(walletAddresses, 'No hd wallet addresses')
      //   addresses = walletAddresses.external.allIds.concat(walletAddresses.change.allIds)
      // }

      // const transaction = yield call(btcChain.getTransaction, transactionId)
      // console.log('transaction', transaction)

      // const item = transaction
      // item.id = item.txid
      // item.timestamp = +item.time * 1000

      // const internalInput = []
      // const externalInput = []
      // item.vin.forEach((item: string) => {
      //   if (addresses.indexOf(item.addr) !== -1) {
      //     internalInput.push(item)
      //   } else {
      //     externalInput.push(item)
      //   }
      // })

      // const internalOutput = []
      // const externalOutput = []
      // item.vout.forEach((item: string) => {
      //   if (item.scriptPubKey && item.scriptPubKey.addresses && item.scriptPubKey.addresses.length) {
      //     const scriptPubKeyAddresses = item.scriptPubKey.addresses
      //     let hasInternalAddress = false

      //     for (let i = 0; i < scriptPubKeyAddresses.length; i++) {
      //       if (addresses.indexOf(scriptPubKeyAddresses[i]) !== -1) {
      //         hasInternalAddress = true
      //         break
      //       }
      //     }

      //     if (hasInternalAddress) {
      //       internalOutput.push(item)
      //     } else {
      //       externalOutput.push(item)
      //     }
      //   } else {
      //     externalOutput.push(item)
      //   }
      // })

      // const internalInputValue = internalInput.reduce((value: number, input: any) => +value + +input.value, 0)
      // const externalInputValue = externalInput.reduce((value: number, input: any) => +value + +input.value, 0)
      // const internalOutputValue = internalOutput.reduce((value: number, input: any) => +value + +input.value, 0)
      // const externalOutputValue = externalOutput.reduce((value: number, input: any) => +value + +input.value, 0)
      // const fees = item.fees
      // const isSender = internalInputValue >= internalOutputValue + fees
      // const transactionType = isSender ? 'send' : 'receive'
      // const change = isSender ? +(+internalOutputValue + +fees - +internalInputValue).toFixed(8) : +(+internalOutputValue - +internalInputValue).toFixed(8)
      // const targetAddress = isSender ? externalOutput[0].scriptPubKey.addresses[0] : externalInput[0].addr

      // yield put(actions.addTransaction({ id: `${chain}/${address}`, item: { ...item, change, transactionType, targetAddress }, assetId }))
    } else if (chain === 'ETHEREUM') {
      // const result = yield call(ethChain.getTransaction, transactionId)
      // console.log(result)
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
      // console.log(tx)
      // yield put(actions.addTransaction({ id: `${chain}/${address}`, item: tx, assetId }))
    } else if (chain === 'EOS') {
      // const result = yield call(api.getEOSTransaction, { hash: transactionId })
      // console.log(result)
      // const isSender = result.sender === address
      // const transactionType = isSender ? 'send' : 'receive'
      // const amount = result.quantity
      // const change = isSender ? -+amount : +amount
      // const targetAddress = isSender ? result.receiver : result.sender

      // const tx = {
      //     ...result,
      //   id: result.trx_id,
      //   timestamp: +new Date(result.timestamp),
      //   change,
      //   targetAddress,
      //   transactionType
      // }
      // console.log(tx)
    } else if (chain === 'CHAINX') {
      const transaction = yield call(chainxChain.getTransaction, transactionId)
    }

    yield put(actions.getTransaction.succeeded())
  } catch (e) {
    yield put(actions.getTransaction.failed(getErrorMessage(e)))
  }
}

function* authorizeEOSAccount(action: Action) {
  if (!action.payload) return

  try {
    const { password, authorizeWallet, simpleWallet } = action.payload
    yield delay(500)
    const id = authorizeWallet.id
    const chain = authorizeWallet.chain
    const accountName = authorizeWallet.address
    const uuID = simpleWallet.uuID
    const ref = 'BitPortal'

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    assert(chain === 'EOS', 'Invalid chain type')

    const allAccounts = yield select((state: RootState) => state.account)
    const account = allAccounts.byId[`${chain}/${accountName}`]
    assert(account, 'No eos account')

    const timestamp = +Date.now()
    const data = String(timestamp) + accountName + uuID + ref
    const signedData = yield call(eosChain.simpleWalletSign, password, keystore, data, accountName, account.permissions)

    const result = yield call(api.simpleWalletAuthorize, {
      protocol: simpleWallet.protocol,
      version: simpleWallet.version,
      sign: signedData,
      uuID: simpleWallet.uuID,
      account: accountName,
      ref: 'BitPortal',
      loginUrl: simpleWallet.loginUrl,
      timestamp
    })

    if (!result.code) {
      yield put(actions.authorizeEOSAccount.succeeded())
      dismissAllModals()
    } else {
      assert(false, result.error)
    }
  } catch (e) {
    yield put(actions.authorizeEOSAccount.failed(getErrorMessage(e)))
  }
}

function* authorizeCreateEOSAccount(action: Action) {
  if (!action.payload) return

  try {
    const { password, authorizeWallet, name, active, owner } = action.payload
    yield delay(500)
    const id = authorizeWallet.id
    const chain = authorizeWallet.chain
    const accountName = authorizeWallet.address

    const importedKeystore = yield call(secureStorage.getItem, `IMPORTED_WALLET_KEYSTORE_${id}`, true)
    const identityKeystore = yield call(secureStorage.getItem, `IDENTITY_WALLET_KEYSTORE_${id}`, true)
    const keystore = importedKeystore || identityKeystore
    assert(keystore && keystore.crypto, 'No keystore')

    assert(chain === 'EOS', 'Invalid chain type')

    const allAccounts = yield select((state: RootState) => state.account)
    const account = allAccounts.byId[`${chain}/${accountName}`]
    assert(account, 'No eos account')

    yield call(eosChain.createAccount, password, keystore, accountName, name, active, owner, account.permissions)
    yield put(actions.authorizeCreateEOSAccount.succeeded())
    dismissAllModals()
  } catch (e) {
    yield put(actions.authorizeCreateEOSAccount.failed(getErrorMessage(e)))
  }
}

export default function* transactionSaga() {
  yield takeLatest(String(actions.buyRAM.requested), buyRAM)
  yield takeLatest(String(actions.sellRAM.requested), sellRAM)
  yield takeLatest(String(actions.delegateBW.requested), delegateBW)
  yield takeLatest(String(actions.undelegateBW.requested), undelegateBW)
  yield takeLatest(String(actions.transfer.requested), transfer)
  yield takeLatest(String(actions.vote.requested), vote)
  yield takeLatest(String(actions.getTransactions.requested), getTransactions)
  yield takeLatest(String(actions.getTransactions.refresh), getTransactions)
  yield takeLatest(String(actions.getTransaction.requested), getTransaction)
  yield takeLatest(String(actions.getTransaction.refresh), getTransaction)
  yield takeLatest(String(actions.authorizeEOSAccount.requested), authorizeEOSAccount)
  yield takeLatest(String(actions.authorizeCreateEOSAccount.requested), authorizeCreateEOSAccount)
}
