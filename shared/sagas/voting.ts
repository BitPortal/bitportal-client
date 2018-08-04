import assert from 'assert'
import { select, call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/voting'
import { getEOSAccountRequested } from 'actions/eosAccount'
import secureStorage from 'utils/secureStorage'
import { getErrorMessage } from 'utils'
import { decrypt, getEOSWifsByInfo } from 'core/key'
import { initEOS, sortProducers } from 'core/eos'
import wif from 'wif'

function* votingRequested(action: Action<VotingParams>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    assert(eosAccountName, 'Please import account!')
    const password = action.payload.password

    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    const permission = yield select((state: RootState) => state.wallet.get('data').get('permission') || 'ACTIVE')
    const wifs = yield call(getEOSWifsByInfo, password, accountInfo, [permission])
    const keyProvider = wifs.map((item: any) => item.wif)

    const producers = action.payload.producers.sort(sortProducers)

    let eos = yield call(initEOS, {})
    const chainInfo = yield call(eos.getInfo, {})
    eos = yield call(initEOS, { chainId: chainInfo.chain_id })
    const blockInfo = yield call(eos.getBlock, chainInfo.last_irreversible_block_num)
    const expireInSeconds = 60 * 1
    const block_num = blockInfo.block_num
    const ref_block_num = block_num & 0xFFFF
    const ref_block_prefix = blockInfo.ref_block_prefix
    const options = {
      broadcast: false,
      sign: true,
      authorization: eosAccountName
    }

    const headers = {
      ref_block_num,
      ref_block_prefix,
      expiration: new Date(new Date().getTime() + expireInSeconds * 1000).toISOString().split('.')[0],
      net_usage_words: 0,
      max_cpu_usage_ms: 0,
      delay_sec: 0
    }

    eos = yield call(initEOS, {
      keyProvider,
      transactionHeaders: (_: any, callback: any) => callback(null, headers),
      broadcast: false,
      sign: true,
      chainId: chainInfo.chainId,
      // checkChainId: false - enable after merge of https://github.com/EOSIO/eosjs/pull/179
    })
    const transactionInfo = yield call(
      eos.transaction,
      (tr: any) => tr.voteproducer({ producers, voter: eosAccountName, proxy: '' }),
      options
    )

    eos = yield call(initEOS, { broadcast: true })

    yield call(eos.pushTransaction, transactionInfo.transaction)
    yield put(actions.votingSucceeded(producers))
    yield put(getEOSAccountRequested({ eosAccountName }))
  } catch (e) {
    console.log(e)
    yield put(actions.votingFailed(getErrorMessage(e)))
  }
}

export default function* votingSaga() {
  yield takeEvery(String(actions.votingRequested), votingRequested)
}
