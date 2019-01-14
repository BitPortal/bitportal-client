/* eslint-disable */
// <scriptSig> {serialized scriptPubKey script}

import bscript from '../../script'

import p2ms from '../multisig/'
import p2pk from '../pubkey/'
import p2pkh from '../pubkeyhash/'
import p2wpkho from '../witnesspubkeyhash/output'
import p2wsho from '../witnessscripthash/output'

const Buffer = require('safe-buffer').Buffer
function check (script, allowIncomplete) {
  const chunks = bscript.decompile(script)
  if (chunks.length < 1) return false

  const lastChunk = chunks[chunks.length - 1]
  if (!Buffer.isBuffer(lastChunk)) return false

  const scriptSigChunks = bscript.decompile(bscript.compile(chunks.slice(0, -1)))
  const redeemScriptChunks = bscript.decompile(lastChunk)

  // is redeemScript a valid script?
  if (!redeemScriptChunks) return false

  // is redeemScriptSig push only?
  if (!bscript.isPushOnly(scriptSigChunks)) return false

  // is witness?
  if (chunks.length === 1) {
    return p2wsho.check(redeemScriptChunks) ||
      p2wpkho.check(redeemScriptChunks)
  }

  // match types
  if (p2pkh.input.check(scriptSigChunks) &&
    p2pkh.output.check(redeemScriptChunks)) return true

  if (p2ms.input.check(scriptSigChunks, allowIncomplete) &&
    p2ms.output.check(redeemScriptChunks)) return true

  if (p2pk.input.check(scriptSigChunks) &&
    p2pk.output.check(redeemScriptChunks)) return true

  return false
}
check.toJSON = function () { return 'scriptHash input' }

export default { check }
