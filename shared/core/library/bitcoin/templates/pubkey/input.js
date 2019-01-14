/* eslint-disable */
// {signature}

import bscript from '../../script'

function check (script) {
  const chunks = bscript.decompile(script)

  return chunks.length === 1 &&
    bscript.isCanonicalScriptSignature(chunks[0])
}
check.toJSON = function () { return 'pubKey input' }

export default {
  check: check
}
