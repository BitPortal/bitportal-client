/* eslint-disable */
// {signature} {pubKey}

import bscript from '../../script'

function check (script) {
  const chunks = bscript.decompile(script)

  return chunks.length === 2 &&
    bscript.isCanonicalScriptSignature(chunks[0]) &&
    bscript.isCanonicalPubKey(chunks[1])
}
check.toJSON = function () { return 'pubKeyHash input' }

export default { check }
