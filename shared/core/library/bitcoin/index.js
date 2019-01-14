/* eslint-disable */
import script from './script'

import Block from './block'
import ECPair from './ecpair'
import Transaction from './transaction'
import TransactionBuilder from './transaction_builder'

import address from './address'
import bip32 from 'bip32'
import crypto from './crypto'
import networks from './networks'
import opcodes from 'bitcoin-ops'
import payments from './payments'

export default {
  script,
  Block,
  ECPair,
  Transaction,
  TransactionBuilder,
  address,
  bip32,
  crypto,
  networks,
  opcodes,
  payments
}
