/* eslint-disable */
// m [pubKeys ...] n OP_CHECKMULTISIG

import bscript from '../../script'
import types from '../../types'
import OPS from 'bitcoin-ops'
const OP_INT_BASE = OPS.OP_RESERVED // OP_1 - 1

function check (script, allowIncomplete) {
  const chunks = bscript.decompile(script)

  if (chunks.length < 4) return false
  if (chunks[chunks.length - 1] !== OPS.OP_CHECKMULTISIG) return false
  if (!types.Number(chunks[0])) return false
  if (!types.Number(chunks[chunks.length - 2])) return false
  const m = chunks[0] - OP_INT_BASE
  const n = chunks[chunks.length - 2] - OP_INT_BASE

  if (m <= 0) return false
  if (n > 16) return false
  if (m > n) return false
  if (n !== chunks.length - 3) return false
  if (allowIncomplete) return true

  const keys = chunks.slice(1, -2)
  return keys.every(bscript.isCanonicalPubKey)
}
check.toJSON = function () { return 'multi-sig output' }

export default { check }
