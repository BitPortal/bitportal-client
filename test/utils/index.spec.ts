import { expect } from 'chai'
import {
  eosQrString,
  getPasswordStrength,
  parseEOSQrString,
  getErrorMessage
} from 'utils'

describe('Generate EOS Qrcode String', () => {
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

describe('Parse EOS Qrcode String', () => {
  it('should get eosAccountName', () => {
    const { eosAccountName } = parseEOSQrString('eos:terencegehui')
    expect(eosAccountName).to.equal('terencegehui')
  })

  it('should get amount', () => {
    const { amount } = parseEOSQrString('eos:terencegehui?amount=999&token=EOS')
    expect(amount).to.equal('999')
  })

  it('should get token', () => {
    const { token } = parseEOSQrString('eos:terencegehui?amount=999&token=EOS')
    expect(token).to.equal('EOS')
  })
})

describe('Get Password Strength', () => {
  it('should get password strength 0 for null', () => {
    const strength: number = getPasswordStrength(null)
    expect(strength).to.equal(0)
  })

  it('should get password strength 0 for "12345"', () => {
    const strength: number = getPasswordStrength('12345')
    expect(strength).to.equal(0)
  })

  it('should get password strength 1 for "ascbefg"', () => {
    const strength: number = getPasswordStrength('ascbefg')
    expect(strength).to.equal(1)
  })

  it('should get password strength 2 for "ascbefg12345"', () => {
    const strength: number = getPasswordStrength('ascbefg12345')
    expect(strength).to.equal(2)
  })

  it('should get password strength 3 for "123456hjsd::.,"', () => {
    const strength: number = getPasswordStrength('123456hjsd::.,')
    expect(strength).to.equal(3)
  })
})

describe('Get Error Message', () => {
  it('should get error message for object', () => {
    const message: string = getErrorMessage({ message: 'this is the error message' })
    expect(message).to.equal('this is the error message')
  })
})
