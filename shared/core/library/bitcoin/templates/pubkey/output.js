/* eslint-disable */
// {pubKey} OP_CHECKSIG

import bscript from '../../script'
import OPS from 'bitcoin-ops'

function check (script) {
  const chunks = bscript.decompile(script)

  return chunks.length === 2 &&
    bscript.isCanonicalPubKey(chunks[0]) &&
    chunks[1] === OPS.OP_CHECKSIG
}
check.toJSON = function () { return 'pubKey output' }

export default { check }
