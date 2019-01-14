import { expect } from 'chai'
import bitcoin from 'core/library/bitcoin'

describe('transaction', () => {
  it('bitcoinjs', async () => {
    const alice = bitcoin.ECPair.fromWIF('93RzyYDHJHe69tpfMp1JNxxjefQu67c7QAbwfRX5U9bm5bdSwcU')
    const txb = new bitcoin.TransactionBuilder()

    txb.setVersion(1)
    txb.addInput('98092988b6bcc8c270eb4240b394a4763b4421f98e45729a6b20d6852426001a', 1) // Alice's previous transaction output, has 15000 satoshis
    txb.addOutput('mhJJn7YgH1zGGxqw7J4NYiC1oEgJwFTW54', 120)
    // (in)15000 - (out)12000 = (fee)3000, this is the miner fee

    txb.sign(0, alice)
    console.log(txb.build().toHex())
    expect(true).to.be.true
  })
})
