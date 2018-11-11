import assert from 'assert'
import { randomBytes, pbkdf2, scrypt, keccak256 } from 'core/crypto'
import { createHash, createCipheriv, createDecipheriv } from 'crypto'

const decipherBuffer = (decipher: any, data: any) => {
  return Buffer.concat([decipher.update(data), decipher.final()])
}

export const hashPassword = (password: string) => {
  const hashed1 = createHash('sha256').update(Buffer.from(password).toString('hex')).digest()
  const hashed2 = createHash('sha256').update(hashed1).digest()
  return hashed2.toString('hex')
}

const generateMac = (derivedKey: string, ciphertext: string) => {
   return keccak256(Buffer.concat([Buffer.from(derivedKey, 'hex').slice(16, 32), Buffer.from(ciphertext, 'hex')])).toString('hex')
}

export const createCrypto = async (password: string, origin: string, kdfType: string, isCached: boolean) => {
  const salt = (await randomBytes(32)).toString('hex')
  const iv =  (await randomBytes(16)).toString('hex')
  const kdf = kdfType || 'scrypt'
  const kdfparams: any = {
    salt,
    dklen: 32
  }

  let derivedKey

  if (kdf === 'pbkdf2') {
    kdfparams.c = 10240
    kdfparams.prf = 'hmac-sha256'
    derivedKey = await pbkdf2(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.c, kdfparams.dklen, 'sha256')
  } else if (kdf === 'scrypt') {
    kdfparams.n = 8192
    kdfparams.r = 8
    kdfparams.p = 1
    derivedKey = await scrypt(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else {
    throw new Error('Unsupported kdf type')
  }

  const ciphertext = encrypt(derivedKey, iv, origin)
  const mac = generateMac(derivedKey, ciphertext)

  const crypto: any = {
    kdf,
    kdfparams,
    ciphertext,
    mac,
    cipherparams: { iv },
    cipher: 'aes-128-ctr'
  }

  if (isCached) {
    crypto.cachedDerivedKey = {
      derivedKey,
      hashedPassword: hashPassword(password)
    }
  }

  return crypto
}

export const getCachedDerivedKey = async (password: string, crypto: any) => {
  assert(typeof password === 'string', 'Invalid password')

  if (crypto.cachedDerivedKey) {
    if (crypto.cachedDerivedKey.hashedPassword !== hashPassword(password)) {
      throw new Error('Invalid password')
    } else {
      return crypto.cachedDerivedKey.derivedKey
    }
  }

  const derivedKey = getValidDerivedKey(password, crypto)

  return derivedKey
}

export const getValidDerivedKey = async (password: string, crypto: any) => {
  let derivedKey
  let kdfparams: any
  if (crypto.kdf === 'scrypt') {
    kdfparams = crypto.kdfparams

    derivedKey = await scrypt(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else if (crypto.kdf === 'pbkdf2') {
    kdfparams = crypto.kdfparams

    if (kdfparams.prf !== 'hmac-sha256') {
      throw new Error('Unsupported parameters to PBKDF2')
    }

    derivedKey = await pbkdf2(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.c, kdfparams.dklen, 'sha256')
  } else {
    throw new Error('Unsupported key derivation scheme')
  }

  const ciphertext = crypto.ciphertext
  const mac = generateMac(derivedKey, ciphertext)

  if (mac !== crypto.mac) {
    throw new Error('Invalid password')
  }

  return derivedKey
}

export const verifyPassword = async (password: string, crypto: any) => {
  try {
    await getCachedDerivedKey(password, crypto)
    return true
  } catch(e) {
    return false
  }
}

export const clearCachedDerivedKey = (crypto: any) => {
  const cryptoWithoutCachedDerivedKey = { ...crypto }
  cryptoWithoutCachedDerivedKey.cachedDerivedKey = null
  return cryptoWithoutCachedDerivedKey
}

export const cacheDerivedKey = async (password: string, crypto: any) => {
  const derivedKey = getValidDerivedKey(password, crypto)
  const cryptoWithCachedDerivedKey = { ...crypto }
  cryptoWithCachedDerivedKey.cachedDerivedKey = {
    derivedKey,
    hashedPassword: hashPassword(password)
  }
  return cryptoWithCachedDerivedKey
}

export const encrypt = (derivedKey: string, iv: string, origin: string) => {
  const derivedKeyBuffer = Buffer.from(derivedKey, 'hex')
  const ivBuffer = Buffer.from(iv, 'hex')
  const cipher = createCipheriv('aes-128-ctr', derivedKeyBuffer.slice(0, 16), ivBuffer)

  if (!cipher) {
    throw new Error('Unsupported cipher')
  }

  const ciphertext = Buffer.concat([cipher.update(Buffer.from(origin, 'hex')), cipher.final()])

  return ciphertext.toString('hex')
}

export const decrypt = (derivedKey: string, iv: string, ciphertext: string, cipher: string) => {
  const decipher = createDecipheriv(cipher, Buffer.from(derivedKey, 'hex').slice(0, 16), Buffer.from(iv, 'hex'))
  const origin = decipherBuffer(decipher, Buffer.from(ciphertext, 'hex'))
  return origin.toString('hex')
}

export const deriveEncPair = async (password: string, origin: string, crypto: any) => {
  const derivedKey = await getCachedDerivedKey(password, crypto)
  const iv = (await randomBytes(16)).toString('hex')
  const encrypted = encrypt(derivedKey, iv, origin)

  return {
    encStr: encrypted,
    nonce: iv
  }
}

export const decryptEncPair = async (password: string, encPair: any, crypto: any) => {
  const derivedKey = await getCachedDerivedKey(password, crypto)
  const iv = encPair.nonce
  const decrypted = decrypt(derivedKey, iv, encPair.encStr, 'aes-128-ctr')

  return decrypted
}
