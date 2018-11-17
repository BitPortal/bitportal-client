import assert from 'assert'
import wif from 'wif'
import {
  createCipheriv,
  createDecipheriv,
  pbkdf2,
  randomBytes as randombytes
} from 'crypto'
// import { NativeModules } from 'react-native'
import scryptAsync from 'scrypt-async'
import uuidv4 from 'uuid/v4'
import createKeccakHash from 'keccak'
import secureStorage from 'utils/secureStorage'

const keccak = (a: any, bits?: any) => {
  const buffer = Buffer.from(a)
  const kbits = bits || 256
  return createKeccakHash('keccak' + kbits).update(buffer).digest()
}

const decipherBuffer = (decipher: any, data: any) => {
  return Buffer.concat([decipher.update(data), decipher.final()])
}

const randomBytes = async (length: number): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    randombytes(length, (error, bytes) => {
      if (error) {
        reject(error)
      } else {
        resolve(bytes)
      }
    })
  })
}

const pbkdf2Async = async (password: string, salt: string, iterations: number, keylen: number, digest: string) => {
  return new Promise<string>((resolve, reject) => {
    pbkdf2(password, salt, iterations, keylen, digest, (error: any, derivedKey: Buffer) => {
      if (error) {
        reject(error)
      } else {
        resolve(derivedKey.toString('hex'))
      }
    })
  })
}

const scrypt = async (password: string, salt: string, N: number, r: number, p: number, dkLen: number) => {
  return new Promise<string>((resolve) => {
    scryptAsync(Buffer.from(password, 'hex'), Buffer.from(salt, 'hex'), {
      N, r, p, dkLen, encoding: 'hex'
    }, (derivedKey: string) => {
      resolve(derivedKey)
    })
  })
}

export const encrypt = async (input: string, password: string, opts: { origin?: 'classic' | 'hd', bpid?: string, salt?: Buffer, kdf?: string, dklen?: number, c?: number, prf?: string, n?: number, iv?: Buffer, r?: number, p?: number, cipher?: string, uuid?: Buffer, coin?: string } = {}) => {

  assert(input, 'Invalid encrypt input!')
  const entropy = input

  assert(opts.origin === 'classic', 'Invalid origin!')

  let salt = opts.salt
  if (!salt) salt = await randomBytes(32)

  let iv = opts.iv
  if (!iv) iv = await randomBytes(16)

  let derivedKey
  const kdf = opts.kdf || 'scrypt'
  const kdfparams: any = {
    dklen: opts.dklen || 32,
    salt: salt.toString('hex')
  }

  if (kdf === 'pbkdf2') {
    kdfparams.c = opts.c || 262144
    kdfparams.prf = 'hmac-sha256'
    const derivedKeyHex = await pbkdf2Async(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.c, kdfparams.dklen, 'sha256')
    derivedKey = Buffer.from(derivedKeyHex, 'hex')
  } else if (kdf === 'scrypt') {
    kdfparams.n = opts.n || 262144
    kdfparams.r = opts.r || 8
    kdfparams.p = opts.p || 1
    const derivedKeyHex = await scrypt(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
    derivedKey = Buffer.from(derivedKeyHex, 'hex')
  } else {
    throw new Error('Unsupported kdf')
  }

  const cipher = createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv)
  if (!cipher) {
    throw new Error('Unsupported cipher')
  }

  const ciphertext = Buffer.concat([cipher.update(Buffer.from(entropy, 'hex')), cipher.final()])

  const mac = keccak(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))

  let random = opts.uuid
  if (!random) random = await randomBytes(16)

  const keystore: any = {
    version: 1,
    id: uuidv4({ random }),
    crypto: {
      kdf,
      kdfparams,
      ciphertext: ciphertext.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex')
      },
      cipher: opts.cipher || 'aes-128-ctr',
      mac: mac.toString('hex')
    }
  }

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

    const derivedKeyHex = await scrypt(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
    derivedKey = Buffer.from(derivedKeyHex, 'hex')
  } else if (json.crypto.kdf === 'pbkdf2') {
    kdfparams = json.crypto.kdfparams

    if (kdfparams.prf !== 'hmac-sha256') {
      throw new Error('Unsupported parameters to PBKDF2')
    }

    const derivedKeyHex = await pbkdf2Async(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.c, kdfparams.dklen, 'sha256')
    derivedKey = Buffer.from(derivedKeyHex, 'hex')
  } else {
    throw new Error('Unsupported key derivation scheme')
  }

  const ciphertext = Buffer.from(json.crypto.ciphertext, 'hex')

  const mac = keccak(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
  if (mac.toString('hex') !== json.crypto.mac) {
    throw new Error('Key derivation failed - possibly wrong passphrase')
  }

  const decipher = createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'))
  const seed = decipherBuffer(decipher, ciphertext)

  return seed.toString('hex')
}

export const getEOSWifsByInfo = async (password: string, accountInfo: any, checkPermissions: string[]) => {
  assert(accountInfo.permissions && accountInfo.permissions.length, 'EOS account permissions dose not exist!')
  assert(accountInfo.account_name, 'EOS account name dose not exist!')
  assert(typeof checkPermissions === 'object' && !!checkPermissions.length, 'Invalid check permissions!')
  const permissions = accountInfo.permissions
  const eosAccountName = accountInfo.account_name

  const wifs = []

  for (const checkPermission of checkPermissions) {
    const currentPermission = permissions.filter((item: any) => item.perm_name === checkPermission.toLowerCase())
    assert(currentPermission.length && currentPermission[0].required_auth && currentPermission[0].required_auth.keys && currentPermission[0].required_auth.keys.length, 'Current permission dose not exist!')

    const publicKeys = currentPermission[0].required_auth.keys

    for (const publicKey of publicKeys) {
      const key = publicKey.key
      const keystore = await secureStorage.getItem(`CLASSIC_KEYSTORE_EOS_${eosAccountName}_${checkPermission}_${key}`, true)

      if (keystore) {
        const privateKey = await decrypt(keystore, password)
        wifs.push({ permission: checkPermission, wif: wif.encode(0x80, Buffer.from(privateKey, 'hex'), false), publicKey: key })
      }
    }
  }

  return wifs
}

export const validateEOSPublicKeyByInfo = async (accountInfo: any, checkPermission: string, checkKey: string) => {
  assert(accountInfo.permissions && accountInfo.permissions.length, 'EOS account permissions dose not exist!')
  assert(accountInfo.account_name, 'EOS account name dose not exist!')
  assert(checkPermission, 'Invalid checkPermission!')
  assert(checkKey, 'Invalid checkKey!')

  const permissions = accountInfo.permissions
  const currentPermission = permissions.find((item: any) => item.perm_name === checkPermission.toLowerCase())
  assert(currentPermission.required_auth && currentPermission.required_auth.keys && currentPermission.required_auth.keys.length, 'Current permission dose not exist!')

  const publicKeys = currentPermission.required_auth.keys
  const keyInfo = publicKeys.find((item: any) => item.key === checkKey)
  return !!keyInfo && !!keyInfo.key
}
