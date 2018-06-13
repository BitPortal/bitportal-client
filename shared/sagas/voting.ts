import assert from 'assert'
import { call, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-actions'
import * as actions from 'actions/voting'
import { getEOSAccountRequested } from 'actions/eosAccount'
import secureStorage from 'utils/secureStorage'
import { getErrorMessage } from 'utils'
import { decrypt } from 'key'
import { initEOS, sortProducers } from 'eos'
import wif from 'wif'

function* votingRequested(action: Action<object>) {
  if (!action.payload) return

  try {
    const eosAccountName = action.payload.eosAccountName
    assert(eosAccountName, 'Please import account!')
    const password = action.payload.password
    const accountInfo = yield call(secureStorage.getItem, `EOS_ACCOUNT_INFO_${eosAccountName}`, true)
    assert(accountInfo.permissions && accountInfo.permissions.length, 'EOS account permissions dose not exist!')
    const permissions = accountInfo.permissions
    const activePermission = permissions.filter(item => item.perm_name === 'active')
    assert(activePermission.length && activePermission[0].required_auth && activePermission[0].required_auth.keys && activePermission[0].required_auth.keys.length, 'Active permission dose not exist!')

    let activeWifs = []
    const activePublicKeys = activePermission[0].required_auth.keys
    for (const publicKey of activePublicKeys) {
      const key = publicKey.key
      const keystore = yield call(secureStorage.getItem, `CLASSIC_KEYSTORE_EOS_${eosAccountName}_ACTIVE_${key}`, true)
      if (keystore) {
        const privateKey = yield call(decrypt, keystore, password)
        const activeWif = wif.encode(0x80, Buffer.from(privateKey, 'hex'), false)
        activeWifs.push(activeWif)
      }
    }

    const producers = action.payload.producers.sort(sortProducers)

    let eos = initEOS({})
    const chainInfo = yield call(eos.getInfo, {})
    eos = initEOS({ chainId: chainInfo.chain_id })
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
      ref_block_num: ref_block_num,
      ref_block_prefix: ref_block_prefix,
      expiration: new Date(new Date().getTime() + expireInSeconds * 1000).toISOString().split('.')[0],
      net_usage_words: 0,
      max_cpu_usage_ms: 0,
      delay_sec: 0
    }

    eos = initEOS({
      keyProvider: activeWifs,
      transactionHeaders: function(_, callback) {
        callback(null, headers)
      },
      broadcast: false,
      sign: true,
      chainId: chainInfo.chainId,
      // checkChainId: false - enable after merge of https://github.com/EOSIO/eosjs/pull/179
    })
    const transactionInfo = yield call(
      eos.transaction,
      tr => tr.voteproducer({ producers, voter: eosAccountName, proxy: '' }),
      options
    )

    eos = initEOS({ broadcast: true })

    yield call(eos.pushTransaction, transactionInfo.transaction)
    yield put(actions.votingSucceeded(producers))
    yield put(getEOSAccountRequested({ eosAccountName }))
  } catch (e) {
    yield put(actions.votingFailed(getErrorMessage(e)))
  }
}

export default function* votingSaga() {
  yield takeEvery(String(actions.votingRequested), votingRequested)
}
