/* eslint-disable */
import multisig from './templates/multisig'
import nullData from './templates/nulldata'
import pubKey from './templates/pubkey'
import pubKeyHash from './templates/pubkeyhash'
import scriptHash from './templates/scripthash'
import witnessPubKeyHash from './templates/witnesspubkeyhash'
import witnessScriptHash from './templates/witnessscripthash'
import witnessCommitment from './templates/witnesscommitment'
const decompile = require('./script').decompile

const types = {
  P2MS: 'multisig',
  NONSTANDARD: 'nonstandard',
  NULLDATA: 'nulldata',
  P2PK: 'pubkey',
  P2PKH: 'pubkeyhash',
  P2SH: 'scripthash',
  P2WPKH: 'witnesspubkeyhash',
  P2WSH: 'witnessscripthash',
  WITNESS_COMMITMENT: 'witnesscommitment'
}

function classifyOutput (script) {
  if (witnessPubKeyHash.output.check(script)) return types.P2WPKH
  if (witnessScriptHash.output.check(script)) return types.P2WSH
  if (pubKeyHash.output.check(script)) return types.P2PKH
  if (scriptHash.output.check(script)) return types.P2SH

  // XXX: optimization, below functions .decompile before use
  const chunks = decompile(script)
  if (!chunks) throw new TypeError('Invalid script')

  if (multisig.output.check(chunks)) return types.P2MS
  if (pubKey.output.check(chunks)) return types.P2PK
  if (witnessCommitment.output.check(chunks)) return types.WITNESS_COMMITMENT
  if (nullData.output.check(chunks)) return types.NULLDATA

  return types.NONSTANDARD
}

function classifyInput (script, allowIncomplete) {
  // XXX: optimization, below functions .decompile before use
  const chunks = decompile(script)
  if (!chunks) throw new TypeError('Invalid script')

  if (pubKeyHash.input.check(chunks)) return types.P2PKH
  if (scriptHash.input.check(chunks, allowIncomplete)) return types.P2SH
  if (multisig.input.check(chunks, allowIncomplete)) return types.P2MS
  if (pubKey.input.check(chunks)) return types.P2PK

  return types.NONSTANDARD
}

function classifyWitness (script, allowIncomplete) {
  // XXX: optimization, below functions .decompile before use
  const chunks = decompile(script)
  if (!chunks) throw new TypeError('Invalid script')

  if (witnessPubKeyHash.input.check(chunks)) return types.P2WPKH
  if (witnessScriptHash.input.check(chunks, allowIncomplete)) return types.P2WSH

  return types.NONSTANDARD
}

export default {
  input: classifyInput,
  output: classifyOutput,
  witness: classifyWitness,
  types: types
}
