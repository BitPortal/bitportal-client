/* eslint-disable */
// OP_0 {scriptHash}

import bscript from '../../script'
import OPS from 'bitcoin-ops'

function check (script) {
  const buffer = bscript.compile(script)

  return buffer.length === 34 &&
    buffer[0] === OPS.OP_0 &&
    buffer[1] === 0x20
}
check.toJSON = function () { return 'Witness scriptHash output' }

export default { check }
