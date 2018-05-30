import assert from 'assert'
import * as bip32 from 'bip32'
import * as bip44 from 'bip44'
import bip39 from 'react-native-bip39'
import wif from 'wif'
import {
  createHash,
  createHmac,
  createCipheriv,
  createDecipheriv,
  // pbkdf2
} from 'crypto'
import { pbkdf2, scrypt, secp256k1 } from 'react-native-fast-crypto'
import * as RNRandomBytes from 'react-native-randombytes'
import base58 from 'bs58'
// import secp256k1 from 'secp256k1'
// import scryptAsync from 'scrypt-async'
import uuidv4 from 'uuid/v4'
import createKeccakHash from 'keccak'
import { isValidPrivate, privateToPublic } from 'eos'

const keccak = (a, bits) => {
  a = Buffer.from(a)
  if (!bits) bits = 256
  return createKeccakHash('keccak' + bits).update(a).digest()
}

const decipherBuffer = (decipher, data) => {
  return Buffer.concat([decipher.update(data), decipher.final()])
}

const randomBytes = async (length) => {
  return new Promise((resolve, reject) => {
    RNRandomBytes.randomBytes(length, (error, bytes) => {
      if (error) {
        reject(error)
      } else {
        resolve(bytes)
      }
    })
  })
}

// const pbkdf2Async = async (password, salt, iterations, keylen, digest) => {
//   return new Promise((resolve, reject) => {
//     pbkdf2(password, salt, iterations, keylen, digest, (error, derivedKey) => {
//       if (error) {
//         reject(error)
//       } else {
//         resolve(derivedKey)
//       }
//     })
//   })
// }

// const scrypt = async (password, salt, N, r, p, dkLen) => {
//   return new Promise((resolve, reject) => {
//     scryptAsync(password, salt, {
//       N, r, p, dkLen
//     }, (derivedKey) => {
//       resolve(Buffer.from(derivedKey))
//     })
//   })
// }

export const getIdFromEntropy = async (entropy: string) => {
  const phrase = bip39.entropyToMnemonic(entropy)
  const seed = bip39.mnemonicToSeed(phrase)
  const seedInfo = await getIdFromSeed(seed)
  return seedInfo
}

export const getIdFromSeed = async (seed: Buffer) => {
  const MASTER_SALT = Buffer.from('Bitportal seed', 'utf8')
  const privateKey = createHmac('sha256', MASTER_SALT).update(seed).digest()
  // assert(secp256k1.privateKeyVerify(privateKey), 'Invalid private key!')
  const publicKey = await secp256k1.publicKeyCreate(privateKey, true)
  const check = [publicKey]
  const checksum = createHash('rmd160').update(Buffer.concat(check)).digest().slice(0, 4)
  const address = base58.encode(Buffer.concat([publicKey, checksum]))
  const version = '1'
  const id = 'BP' + version + address
  return id
}

export const encrypt = async (input: string, password: string, opts: object) => {

  assert(input, 'Invalid encrypt input!')
  const entropy = Buffer.from(input, 'hex')

  opts = opts || {}

  let bpid

  if (!opts.origin || opts.origin === 'hd') {
    bpid = await getIdFromEntropy(entropy)

    if (opts.bpid) {
      assert(opts.bpid === bpid, 'Entropy and bpid do not match!')
    }
  } else {
    assert(opts.origin === 'classic', 'Invalid origin!')
  }

  let salt = opts.salt
  if (!salt) salt = await randomBytes(32)

  let iv = opts.iv
  if (!iv) iv = await randomBytes(16)

  let derivedKey
  const kdf = opts.kdf || 'scrypt'
  const kdfparams = {
    dklen: opts.dklen || 32,
    salt: salt.toString('hex')
  }

  // if (kdf === 'pbkdf2') {
  //   kdfparams.c = opts.c || 262144
  //   kdfparams.prf = 'hmac-sha512'
  //   derivedKey = await pbkdf2.deriveAsync(Buffer.from(password), salt, kdfparams.c, kdfparams.dklen, 'sha512')
  // } else
  if (kdf === 'scrypt') {
    kdfparams.n = opts.n || 262144
    kdfparams.r = opts.r || 8
    kdfparams.p = opts.p || 1
    derivedKey = await scrypt(Buffer.from(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else {
    throw new Error('Unsupported kdf')
  }

  const cipher = createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv)
  if (!cipher) {
    throw new Error('Unsupported cipher')
  }

  const ciphertext = Buffer.concat([cipher.update(entropy), cipher.final()])

  const mac = keccak(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')]))

  let random = opts.uuid
  if (!random) random = await randomBytes(16)

  const keystore = {
    version: 1,
    id: uuidv4({ random }),
    crypto: {
      ciphertext: ciphertext.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex')
      },
      cipher: opts.cipher || 'aes-128-ctr',
      kdf: kdf,
      kdfparams: kdfparams,
      mac: mac.toString('hex')
    }
  }

  if (bpid) keystore.bpid = bpid
  if (opts.coin) keystore.coin = opts.coin

  return keystore
}

export const decrypt = async (input: object | string, password: string, nonStrict?: boolean) => {
  assert(typeof password === 'string', 'Invalid password!')
  const json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)

  if (json.version !== 1) {
    throw new Error('Not a V1 wallet')
  }

  let derivedKey
  let kdfparams
  if (json.crypto.kdf === 'scrypt') {
    kdfparams = json.crypto.kdfparams
    derivedKey = await scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else {
    throw new Error('Unsupported key derivation scheme')
  }
  // else if (json.crypto.kdf === 'pbkdf2') {
  //   kdfparams = json.crypto.kdfparams

  //   if (kdfparams.prf !== 'hmac-sha512') {
  //     throw new Error('Unsupported parameters to PBKDF2')
  //   }

  //   derivedKey = await pbkdf2.deriveAsync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha512')
  // }

  const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex')

  const mac = keccak(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
  if (mac.toString('hex') !== json.crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong passphrase')
  }

  const decipher = createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'))
  const seed = decipherBuffer(decipher, ciphertext, 'hex')

  return seed.toString('hex')
}

export const getMasterSeedFromEntropy = async (entropy: string) => {
  const phrase = bip39.entropyToMnemonic(entropy)
  const seed = await getMasterSeed(phrase)
}

export const getMasterSeed = async (mnemonicPhrase: string) => {
  let phrase

  if (mnemonicPhrase) {
    phrase = mnemonicPhrase
  } else {
    phrase = await bip39.generateMnemonic()
  }

  assert(bip39.validateMnemonic(phrase), 'Invalid mnemonic phrase!')
  const entropy = bip39.mnemonicToEntropy(phrase)
  const seed = bip39.mnemonicToSeed(phrase)
  const id = await getIdFromSeed(seed)

  return { id, phrase, entropy }
}

export const getEOSKeys = async (entropy, showPrivate) => {
  const phrase = bip39.entropyToMnemonic(entropy)
  const seed = bip39.mnemonicToSeed(phrase)
  const root = bip32.fromMasterSeed(new Buffer(seed, 'hex'))
  const path = bip44.getBIP44Path({ symbol: 'EOS' })

  const eosPrivateKey = root.derive(path).privateKey
  const eosWIF = wif.encode(0x80, eosPrivateKey, false)
  assert(isValidPrivate(eosWIF), 'Invalid eos master wif!')
  const eosMasterWIF = 'PW' + eosWIF

  const eosOwnerPrivateKey = createHash('sha256').update(eosPrivateKey).update('owner').digest()
  const eosOwnerWIF = wif.encode(0x80, eosOwnerPrivateKey, false)
  assert(isValidPrivate(eosOwnerWIF), 'Invalid eos owner wif!')
  const eosOwnerPublicKey = await privateToPublic(eosOwnerPrivateKey)

  const eosActivePrivateKey = createHash('sha256').update(eosOwnerPrivateKey).update('active').digest()
  const eosActiveWIF = wif.encode(0x80, eosActivePrivateKey, false)
  assert(isValidPrivate(eosActiveWIF), 'Invalid eos active wif!')
  const eosActivePublicKey = await privateToPublic(eosActivePrivateKey)

  if (showPrivate) {
    return {
      coin: 'EOS',
      keys: {
        master: {
          privateKey: {
            origin: eosPrivateKey.toString('hex'),
            wif: eosMasterWIF
          }
        },
        owner: {
          privateKey: {
            origin: eosOwnerPrivateKey.toString('hex'),
            wif: eosOwnerWIF
          },
          publicKey: eosOwnerPublicKey
        },
        active: {
          privateKey: {
            origin: eosActivePrivateKey.toString('hex'),
            wif: eosActiveWIF
          },
          publicKey: eosActivePublicKey
        }
      }
    }
  }

  return {
    coin: 'EOS',
    keys: {
      owner: {
        publicKey: eosOwnerPublicKey
      },
      active: {
        publicKey: eosActivePublicKey
      }
    }
  }
}

export const validateEntropy = (entropy: string) => {
  const phrase = bip39.entropyToMnemonic(entropy)
  return bip39.validateMnemonic(phrase)
}
