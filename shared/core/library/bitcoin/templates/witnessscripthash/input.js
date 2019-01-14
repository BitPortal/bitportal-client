/* eslint-disable */
// <scriptSig> {serialized scriptPubKey script}

import bscript from '../../script'
import types from '../../types'
import typeforce from 'typeforce'

import p2ms from '../multisig/'
import p2pk from '../pubkey/'
import p2pkh from '../pubkeyhash/'

function check (chunks, allowIncomplete) {
  typeforce(types.Array, chunks)
  if (chunks.length < 1) return false

  const witnessScript = chunks[chunks.length - 1]
  if (!Buffer.isBuffer(witnessScript)) return false

  const witnessScriptChunks = bscript.decompile(witnessScript)

  // is witnessScript a valid script?
  if (!witnessScriptChunks || witnessScriptChunks.length === 0) return false

  const witnessRawScriptSig = bscript.compile(chunks.slice(0, -1))

  // match types
  if (p2pkh.input.check(witnessRawScriptSig) &&
    p2pkh.output.check(witnessScriptChunks)) return true

  if (p2ms.input.check(witnessRawScriptSig, allowIncomplete) &&
    p2ms.output.check(witnessScriptChunks)) return true

  if (p2pk.input.check(witnessRawScriptSig) &&
    p2pk.output.check(witnessScriptChunks)) return true

  return false
}
check.toJSON = function () { return 'witnessScriptHash input' }

export default { check }
