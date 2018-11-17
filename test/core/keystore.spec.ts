import { expect } from 'chai'
import { getCachedDerivedKey, decrypt, verifyPassword, createCrypto } from 'core/keystore'
import { createIdentity, recoverIdentity } from 'core/wallet'
import { pbkdf2, scrypt } from 'core/crypto'

const keystore = JSON.parse(`{
    "crypto" : {
        "cipher" : "aes-128-ctr",
        "cipherparams" : {
            "iv" : "6087dab2f9fdbbfaddc31a909735c1e6"
        },
        "ciphertext" : "5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46",
        "kdf" : "pbkdf2",
        "kdfparams" : {
            "c" : 262144,
            "dklen" : 32,
            "prf" : "hmac-sha256",
            "salt" : "ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"
        },
        "mac" : "517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"
    },
    "id" : "3198bc9c-6672-5ab3-d995-4942343ae5b6",
    "version" : 3
}`)
const crypto = keystore.crypto
const password = 'testpassword'
const invalidPassword = 'invalidpassword'
const ethPtivateKey = '7a28b5ba57c53603b0b07b56bba752f7784bf506fa95edc395f5cf6c7514fe9d'
const seed = 'behind urge antique viable fashion before atom case bag reunion level develop'

describe('keystore', () => {
  it('decrypt', async () => {
    const derivedKey = await getCachedDerivedKey(password, crypto)
    const iv = crypto.cipherparams.iv
    const ciphertext = crypto.ciphertext
    const cipher = crypto.cipher
    const decrypted = await decrypt(derivedKey, iv, ciphertext, cipher)
    expect(decrypted).to.equal(ethPtivateKey)
  })

  it('verify valid password', async () => {
    const valid = await verifyPassword(password, crypto)
    expect(valid).to.be.true // tslint:disable-line
  })

  it('verify invalid password', async () => {
    const valid = await verifyPassword(invalidPassword, crypto)
    expect(valid).to.be.false // tslint:disable-line
  })

  it('createCrypto', async () => {
    const crypto = await createCrypto(password, ethPtivateKey, 'pbkdf2', true)
    const valid = await verifyPassword(password, crypto)
    expect(valid).to.be.true // tslint:disable-line
  })

  // it('createIdentity', async () => {
  //   const identity = await createIdentity(password, 'terencegehui', '', 'MAINNET', true)
  //   console.log(identity)
  //   expect(true).to.be.true // tslint:disable-line
  // })

  it('recoverIdentity', async () => {
    const identity = await recoverIdentity(seed, password, 'testIdentity', '', 'MAINNET', true)
    expect(identity.keystore.identifier).to.equal('bp18oFghXVnAu7RuBN7TSeo9NKcVrHZGKP39xmF') // tslint:disable-line
  })
})
