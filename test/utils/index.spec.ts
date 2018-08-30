import { expect } from 'chai'
import { eosQrString } from 'utils'

describe('Generate EOS qrcode string', () => {
  it('should get correct format of qrcode string', () => {
    const generatedString: string = eosQrString('terencegehui', 1, 'EOS')
    expect(generatedString).to.equal('eos:terencegehui?amount=1&token=EOS')
  })

  it('should get default token: EOS', () => {
    const generatedString: string = eosQrString('terencegehui', 1)
    expect(generatedString).to.equal('eos:terencegehui?amount=1&token=EOS')
  })

  it('should get default amount: 0', () => {
    const generatedString: string = eosQrString('terencegehui')
    expect(generatedString).to.equal('eos:terencegehui?amount=0&token=EOS')
  })
})
