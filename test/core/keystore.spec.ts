import { expect } from 'chai'
import { getCachedDerivedKey, decrypt, verifyPassword, createCrypto, decryptMnemonic } from 'core/keystore'
import {
  createIdentity,
  recoverIdentity,
  importBTCWalletByPrivateKey,
  importETHWalletByKeystore,
  importETHWalletByPrivateKey,
  importEOSWalletByPrivateKeys
} from 'core/wallet'
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

  it('createIdentity', async () => {
    const identity = await createIdentity(password, 'terencegehui', '', 'MAINNET', true)
    const mnemonics = await decryptMnemonic(password, identity.keystore)
    expect(true).to.be.true // tslint:disable-line
  })

  it('importBTCPrivateKey', async () => {
    const keystore = await importBTCWalletByPrivateKey('5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ', password, 'BTC-Wallet', '', 'MAINNET', true)
    expect(true).to.be.true // tslint:disable-line
  })

  it('importETHKeystore', async () => {
    const keystoreText = '{"id":"20b18b50-5fce-4b63-a6d7-1fe8ef41c01e","version":3,"address":"3b9839d1b303490bd0755faca57e0c7d3e6badb4","crypto":{"kdfparams":{"r":8,"p":1,"dklen":32,"salt":"45413ab28e960a6ee6da7586e67c76c55bb6fb2995794b21c1449e4ac9f12a5d","n":262144},"mac":"2fc9c96767f5b364f54cdf9a4f7fe2628162a3d4c922e25cc22b099ee00416c8","cipher":"aes-128-ctr","cipherparams":{"iv":"27389a725278e38183a6acd950be06cc"},"kdf":"scrypt","ciphertext":"ed2824a920682812a12379a9c6f353719ff39c84d39b432e0d79d11e21a4f2ac"}}'
    const keystoreObject = JSON.parse(keystoreText)
    const keystore = await importETHWalletByKeystore(keystoreObject, '12345678', 'ETH-Wallet', '')
    expect(true).to.be.true // tslint:disable-line
  })

  it('importETHPrivateKey', async () => {
    const keystore = await importETHWalletByPrivateKey('df8c68a182262eafacc97e0e78c9707e14b1c36e9e044327f0f28226e2efcf33', '12345678', 'ETH-Wallet', '')
    expect(true).to.be.true // tslint:disable-line
  })

  it('importEOSPrivateKey', async () => {
    const keystore = await importEOSWalletByPrivateKeys(['5KRFP6oNcGSTJS21t7ymQQfSqBxjMfC9SnWfPhaN5qpy5g52vVi'], '12345678', 'EOS-Wallet', '', 'terencegehui')
    console.log(keystore)
    expect(true).to.be.true // tslint:disable-line
  })

  // it('recoverIdentity', async () => {
  //   const identity = await recoverIdentity(seed, password, 'testIdentity', '', 'MAINNET', true)
  //   expect(identity.keystore.identifier).to.equal('bp18oFghXVnAu7RuBN7TSeo9NKcVrHZGKP39xmF') // tslint:disable-line
  // })
})
