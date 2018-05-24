import assert from 'assert'
import * as bip32 from 'bip32'
import * as bip44 from 'bip44'
import bip39 from 'react-native-bip39'
import wif from 'wif'
import { createHash, createHmac, createCipheriv, createDecipheriv } from 'crypto'
import secp256k1 from 'secp256k1'
import base58 from 'bs58'
import { pbkdf2, scrypt } from 'react-native-fast-crypto'
import uuidv4 from 'uuid/v4'
import { randomBytes } from 'react-native-randombytes'
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

const getRandomBytes = async (length) => {
  return new Promise((resolve, reject) => {
    randomBytes(length, (error, bytes) => {
      if (error) {
        reject(error)
      } else {
        resolve(bytes)
      }
    })
  })
}

export const encrypt = async (seed, password, opts) => {
  assert(seed, 'Invalid seed!')

  opts = opts || {}

  let salt = opts.salt
  if (!salt) salt = await getRandomBytes(32)

  let iv = opts.iv
  if (!iv) iv = await getRandomBytes(16)

  let derivedKey
  const kdf = opts.kdf || 'scrypt'
  const kdfparams = {
    dklen: opts.dklen || 32,
    salt: salt.toString('hex')
  }

  if (kdf === 'pbkdf2') {
    kdfparams.c = opts.c || 262144
    kdfparams.prf = 'hmac-sha512'
    derivedKey = await pbkdf2.deriveAsync(Buffer.from(password), salt, kdfparams.c, kdfparams.dklen, 'sha512')
  } else if (kdf === 'scrypt') {
    // FIXME: support progress reporting callback
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

  const ciphertext = Buffer.concat([cipher.update(seed), cipher.final()])

  const mac = keccak(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')]))

  let random = opts.uuid
  if (!random) random = await getRandomBytes(16)

  return {
    version: 1,
    id: uuidv4({ random }),
    bpid: getIdFromSeed(seed),
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
}

export const decrypt = async (input, password, nonStrict) => {
  assert(typeof password === 'string', 'Invalid password!')
  const json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)

  if (json.version !== 1) {
    throw new Error('Not a V1 wallet')
  }

  let derivedKey
  let kdfparams
  if (json.crypto.kdf === 'scrypt') {
    kdfparams = json.crypto.kdfparams

    // FIXME: support progress reporting callback
    derivedKey = await scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else if (json.crypto.kdf === 'pbkdf2') {
    kdfparams = json.crypto.kdfparams

    if (kdfparams.prf !== 'hmac-sha512') {
      throw new Error('Unsupported parameters to PBKDF2')
    }

    derivedKey = await pbkdf2.deriveAsync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha512')
  } else {
    throw new Error('Unsupported key derivation scheme')
  }

  const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex')

  const mac = keccak(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
  if (mac.toString('hex') !== json.crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong passphrase')
  }

  const decipher = createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'))
  const seed = decipherBuffer(decipher, ciphertext, 'hex')

  return seed
}

export const getIdFromSeed = (seed: string) => {
  const MASTER_SALT = Buffer.from('Bitportal id', 'utf8')
  const privateKey = createHmac('sha256', MASTER_SALT).update(new Buffer(seed, 'hex')).digest()
  assert(secp256k1.privateKeyVerify(privateKey), 'Invalid private key!')
  const publicKey = secp256k1.publicKeyCreate(privateKey)
  const check = [publicKey]
  const checksum = createHash('rmd160').update(Buffer.concat(check)).digest().slice(0, 4)
  const address = base58.encode(Buffer.concat([publicKey, checksum]))
  const id = 'BP1' + address
  return id
}

export const getMasterSeed = async (mnemonicPhrase: string) => {
  let phrase

  if (mnemonicPhrase) {
    phrase = mnemonicPhrase
  } else {
    phrase = await bip39.generateMnemonic()
  }

  assert(bip39.validateMnemonic(phrase), 'Invalid mnemonic phrase!')
  const seed = bip39.mnemonicToSeed(phrase)
  const id = getIdFromSeed(seed)

  return { phrase, seed, id }
}

export const getEOSKeys = async (seed, showPrivate) => {
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
