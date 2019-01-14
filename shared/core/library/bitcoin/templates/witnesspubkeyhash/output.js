/* eslint-disable */
// OP_0 {pubKeyHash}

import bscript from '../../script'
import OPS from 'bitcoin-ops'

function check (script) {
  const buffer = bscript.compile(script)

  return buffer.length === 22 &&
    buffer[0] === OPS.OP_0 &&
    buffer[1] === 0x14
}
check.toJSON = function () { return 'Witness pubKeyHash output' }

export default {
  check
}
