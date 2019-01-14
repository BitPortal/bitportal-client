/* eslint-disable */
import accumulative from './accumulative'
import blackjack from './blackjack'
import utils from './utils'

// order by descending value, minus the inputs approximate fee
function utxoScore (x, feeRate) {
  return x.value - (feeRate * utils.inputBytes(x))
}

export default function coinSelect (utxos, outputs, feeRate) {
  utxos = utxos.concat().sort(function (a, b) {
    return utxoScore(b, feeRate) - utxoScore(a, feeRate)
  })

  // attempt to use the blackjack strategy first (no change output)
  var base = blackjack(utxos, outputs, feeRate)
  if (base.inputs) return base

  // else, try the accumulative strategy
  return accumulative(utxos, outputs, feeRate)
}
