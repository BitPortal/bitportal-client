/* eslint-disable */
// OP_RETURN {data}

import bscript from '../script'
import OPS from 'bitcoin-ops'

function check (script) {
  const buffer = bscript.compile(script)

  return buffer.length > 1 &&
    buffer[0] === OPS.OP_RETURN
}
check.toJSON = function () { return 'null data output' }

export default { output: { check: check } }
