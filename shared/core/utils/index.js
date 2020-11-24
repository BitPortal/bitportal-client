import assert from 'assert'
import uuidv4 from 'uuid/v4'
import * as bip39 from 'bip39'
import { createHash, createCipheriv, createDecipheriv } from 'crypto'
import secp256k1 from 'secp256k1'
import bs58check from 'bs58check'
import bs58 from 'bs58'
import bech32 from 'bech32'
import { randomBytes, pbkdf2, scrypt, keccak256, hash160, ripemd160 } from '../crypto'

export const randomUUID = async (id) => {
  if (id) return id

  const random = await randomBytes(16)
  return uuidv4({ random })
}

export const validatePolkadotKeystore = (keystore) => {
  assert(keystore, 'No keystore')
  assert(keystore.encoding && keystore.encoding.content, 'No keystore encoding')
  assert(keystore.address, 'No keystore address')
  assert(keystore.encoded, 'No keystore encoded')
}

export const validateBip39Mnemonics = (mnemonics) => {
  assert(bip39.validateMnemonic(mnemonics), 'Invalid mnemonics')
}

const decipherBuffer = (decipher, data) => {
  return Buffer.concat([decipher.update(data), decipher.final()])
}

const generateMac = async (derivedKey, ciphertext) => {
  return (await keccak256(Buffer.concat([Buffer.from(derivedKey, 'hex').slice(16, 32), Buffer.from(ciphertext, 'hex')]))).toString('hex')
}

export const toChecksumAddress = async (address) => {
  const rawAddress = address.toLowerCase().replace('0x', '')
  const hash = (await keccak256(rawAddress)).toString('hex')
  let ret = '0x'

  for (let i = 0; i < rawAddress.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += rawAddress[i].toUpperCase()
    } else {
      ret += rawAddress[i]
    }
  }

  return ret
}

export const encrypt = async (derivedKey, iv, origin, cipherType) => {
  const derivedKeyBuffer = Buffer.from(derivedKey, 'hex')
  const ivBuffer = Buffer.from(iv, 'hex')
  const cipher = createCipheriv(cipherType, derivedKeyBuffer.slice(0, 16), ivBuffer)

  if (!cipher) {
    throw new Error('Unsupported cipher')
  }

  const ciphertext = Buffer.concat([cipher.update(Buffer.from(origin, 'hex')), cipher.final()])

  return ciphertext.toString('hex')
}

export const getValidDerivedKey = async (password, crypto) => {
  let derivedKey
  let kdfparams
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
  const mac = await generateMac(derivedKey, ciphertext)

  if (mac !== crypto.mac) {
    throw new Error('Invalid password')
  }

  return derivedKey
}

export const hashPassword = (password) => {
  const hashed1 = createHash('sha256').update(Buffer.from(password).toString('hex')).digest()
  const hashed2 = createHash('sha256').update(hashed1).digest()
  return hashed2.toString('hex')
}

export const createCrypto = async (password, origin, kdfType, isCached) => {
  const salt = (await randomBytes(32)).toString('hex')
  const iv = (await randomBytes(16)).toString('hex')
  const kdf = kdfType || 'scrypt'
  const kdfparams = {
    salt,
    dklen: 32
  }

  let derivedKey

  if (kdf === 'pbkdf2') {
    kdfparams.c = 65535 // 10240
    kdfparams.prf = 'hmac-sha256'
    derivedKey = await pbkdf2(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.c, kdfparams.dklen, 'sha256')
  } else if (kdf === 'scrypt') {
    kdfparams.n = 1024//262144 // 8192
    kdfparams.r = 8
    kdfparams.p = 1
    derivedKey = await scrypt(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else {
    throw new Error('Unsupported kdf type')
  }

  const cipher = 'aes-128-ctr'
  const ciphertext = await encrypt(derivedKey, iv, origin, cipher)
  const mac = await generateMac(derivedKey, ciphertext)

  const crypto = {
    kdf,
    kdfparams,
    ciphertext,
    mac,
    cipher,
    cipherparams: { iv }
  }

  if (isCached) {
    crypto.cachedDerivedKey = {
      derivedKey,
      hashedPassword: hashPassword(password)
    }
  }

  return crypto
}

export const getCachedDerivedKey = async (password, crypto) => {
  assert(typeof password === 'string', 'Invalid password')

  if (crypto.cachedDerivedKey) {
    if (crypto.cachedDerivedKey.hashedPassword !== hashPassword(password)) {
      throw new Error('Invalid password')
    } else {
      return crypto.cachedDerivedKey.derivedKey
    }
  }

  const derivedKey = await getValidDerivedKey(password, crypto)

  return derivedKey
}

export const verifyPassword = async (password, crypto) => {
  try {
    await getCachedDerivedKey(password, crypto)
    return true
  } catch (e) {
    return false
  }
}

export const clearCachedDerivedKey = (crypto) => {
  const cryptoWithoutCachedDerivedKey = { ...crypto }
  delete cryptoWithoutCachedDerivedKey.cachedDerivedKey
  return cryptoWithoutCachedDerivedKey
}

export const cacheDerivedKey = async (password, crypto) => {
  const derivedKey = await getValidDerivedKey(password, crypto)
  const cryptoWithCachedDerivedKey = { ...crypto }
  cryptoWithCachedDerivedKey.cachedDerivedKey = {
    derivedKey,
    hashedPassword: hashPassword(password)
  }
  return cryptoWithCachedDerivedKey
}

export const decrypt = async (derivedKey, iv, ciphertext, cipher) => {
  const decipher = createDecipheriv(cipher, Buffer.from(derivedKey, 'hex').slice(0, 16), Buffer.from(iv, 'hex'))

  const origin = decipherBuffer(decipher, Buffer.from(ciphertext, 'hex'))
  return origin.toString('hex')
}

export const deriveEncPair = async (password, origin, crypto) => {
  const derivedKey = await getCachedDerivedKey(password, crypto)
  const iv = (await randomBytes(16)).toString('hex')
  const encrypted = await encrypt(derivedKey, iv, origin, crypto.cipher)

  return {
    encStr: encrypted,
    nonce: iv
  }
}

export const decryptEncPair = async (password, encPair, crypto) => {
  const derivedKey = await getCachedDerivedKey(password, crypto)
  const iv = encPair.nonce
  const decrypted = await decrypt(derivedKey, iv, encPair.encStr, crypto.cipher)

  return decrypted
}

// export const bip32Path = (chain, options) => {
//   switch (chain) {
//     case 'bitcoin': {
//       const { network, isSegWit } = options

//       if (isSegWit) {
//         if (network === 'testnet') {
//           return `m/49'/1'/0'`
//         }

//         return `m/49'/0'/0'`
//       } else {
//         if (network === 'testnet') {
//           return `m/44'/1'/0'`
//         }

//         return `m/44'/0'/0'`
//       }
//     }
//     case 'ethereum':
//       return `m/44'/60'/0'`
//     case 'eos':
//       return `m/44'/194'/0'`
//     default:
//       throw new Error(`unsupported chain type ${chain}`)
//   }
// }

// export const deriveKeyPair = async (mnemonics, path) => {
//   const seed = await bip39.mnemonicToSeed(mnemonics)
//   const hdkey = HDKey.fromMasterSeed(seed)
//   const parentkey = hdkey.derive(path)

//   return {
//     privateKey: parentkey.privateKey,
//     publicKey: parentkey.publicKey,
//     privateExtendedKey: parentkey.privateExtendedKey,
//     publicExtendedKey: parentkey.publicExtendedKey
//   }
// }

export const publicKeyToAddress = async (value, chain, options) => {
  switch (chain) {
    case 'bitcoin':
    case 'BTC': {
      const isSegWit = options.isSegWit
      const isP2SH = options.isP2SH
      const isTestNet = options.isTestNet
      const scriptHash = isTestNet ? 'c4' : '05'
      const bech32Prefix = isTestNet ? 'tb' : 'bc'
      const pubKeyHash = isTestNet ? '6f' : '00'
      const mainPublicKeyHash = hash160(value)
      let address

      if (isSegWit) {
        if (isP2SH) {
          const redeemHash = hash160(Buffer.from('0014' + mainPublicKeyHash.toString('hex'), 'hex'))
          address = bs58check.encode(Buffer.from(scriptHash + redeemHash.toString('hex'), 'hex'))
        } else {
          const words = bech32.toWords(mainPublicKeyHash)
          words.unshift(0x00)
          address = bech32.encode(bech32Prefix, words)
        }
      } else {
        address = bs58check.encode(Buffer.from(pubKeyHash + mainPublicKeyHash.toString('hex'), 'hex'))
      }

      return address
    }
    case 'litecoin': {
      const isSegWit = options.isSegWit
      const isP2SH = options.isP2SH
      const mainPublicKeyHash = hash160(value)
      let address

      if (isSegWit) {
        if (isP2SH) {
          const redeemHash = hash160(Buffer.from('0014' + mainPublicKeyHash.toString('hex'), 'hex'))
          address = bs58check.encode(Buffer.from('32' + redeemHash.toString('hex'), 'hex'))
        } else {
          const words = bech32.toWords(mainPublicKeyHash)
          words.unshift(0x00)
          address = bech32.encode('ltc', words)
        }
      } else {
        address = bs58check.encode(Buffer.from('30' + mainPublicKeyHash.toString('hex'), 'hex'))
      }

      return address
    }
    case 'ethereum':
    case 'ETH': {
      const a = await keccak256(value)
      const lowerCaseAddress = '0x' + a.slice(-20).toString('hex')
      const address = await toChecksumAddress(lowerCaseAddress)

      return address
    }
    case 'eos': {
      const publicKeyHash = ripemd160(value)
      const address = 'EOS' + bs58.encode(Buffer.from(value.toString('hex') + publicKeyHash.slice(0, 4).toString('hex'), 'hex'))

      return address
    }
    default:
      throw new Error(`unsupported chain type ${chain}`)
  }
}

export const privateKeyToAddress = async (value, chain, options) => {
  switch (chain) {
    case 'bitcoin': {
      const isSegWit = options.isSegWit
      const isP2SH = options.isP2SH
      const mainPublicKey = secp256k1.publicKeyCreate(value)
      const mainPublicKeyHash = hash160(mainPublicKey)
      let address

      if (isSegWit) {
        if (isP2SH) {
          const redeemHash = hash160(Buffer.from('0014' + mainPublicKeyHash.toString('hex'), 'hex'))
          address = bs58check.encode(Buffer.from('05' + redeemHash.toString('hex'), 'hex'))
        } else {
          const words = bech32.toWords(mainPublicKeyHash)
          words.unshift(0x00)
          address = bech32.encode('bc', words)
        }
      } else {
        address = bs58check.encode(Buffer.from('00' + mainPublicKeyHash.toString('hex'), 'hex'))
      }

      return address
    }
    case 'ethereum': {
      const publicKey = secp256k1.publicKeyCreate(value, false).slice(1)
      const a = await keccak256(publicKey)
      const lowerCaseAddress = '0x' + a.slice(-20).toString('hex')
      const address = await toChecksumAddress(lowerCaseAddress)

      return address
    }
    case 'eos': {
      const publicKey = secp256k1.publicKeyCreate(value)
      const publicKeyHash = ripemd160(publicKey)
      const address = 'EOS' + bs58.encode(Buffer.from(publicKey.toString('hex') + publicKeyHash.slice(0, 4).toString('hex'), 'hex'))

      return address
    }
    default:
      throw new Error(`unsupported chain type ${chain}`)
  }
}

// export const wifToPrivateKey = async (wif, chain, options) => {
//   switch (chain) {
//     case 'bitcoin': {
//       const isSegWit = options.isSegWit

//       let privateKey
//       const wifBuffer = bs58check.decode(wif)

//       const compressed = wifBuffer.length !== 33

//       if (compressed) {
//         assert(wifBuffer.length === 34, 'Invalid WIF length')
//         assert(wifBuffer[33] === 0x01, 'Invalid compression flag')
//       } else {
//         assert(!isSegWit, 'SegWit requires compressed private key')
//       }

//       privateKey = wifBuffer.slice(1, 33)
//       return privateKey
//     }
//     case 'eos': {
//       let privateKey
//       const wifBuffer = bs58check.decode(wif.trim())

//       const compressed = wifBuffer.length !== 33

//       if (compressed) {
//         assert(wifBuffer.length === 34, 'Invalid WIF length')
//         assert(wifBuffer[33] === 0x01, 'Invalid compression flag')
//       }

//       privateKey = wifBuffer.slice(1, 33)
//       return privateKey
//     }
//     default:
//       throw new Error(`unsupported chain type ${chain}`)
//   }
// }

// export const validateEthereumKeystore = (keystore) => {
//   assert(keystore, 'No keystore')
//   assert(keystore.version === 3, 'Invalid keystore version')
//   assert(keystore.crypto, 'No keystore crypto')
//   const crypto = keystore.crypto
//   assert(crypto.cipherparams, 'No keystore crypto cipherparams')
//   assert(crypto.ciphertext, 'No keystore crypto ciphertext')
//   assert(crypto.cipher, 'No keystore crypto cipher')
//   const cipherparams = crypto.cipherparams
//   assert(cipherparams.iv, 'No keystore crypto cipherparams iv')
// }

// export const validateMnemonicPath = (mnemonicPath, chain, options) => {
//   const path = bip32Path(chain, options)
//   const leadingPath = path.slice(-2)

//   assert(mnemonicPath.indexOf(leadingPath) !== -1, 'Invalid mnemonic path')
//   const pathElements = mnemonicPath.split('/')
//   assert(pathElements.length === 6 || pathElements.length === 5, 'Invalid mnemonic path elements length')
//   assert(pathElements[3].slice(-1) === `'` && +pathElements[3].slice(0, -1) < 10, 'Invalid mnemonic path 3th element')
//   assert(+pathElements[4] < 1000000, 'Invalid mnemonic path 4th element')
//   if (pathElements.length === 6) assert(+pathElements[5] < 1000000, 'Invalid mnemonic path 5th element')
// }

// export const validateKeystoreForMnemonics = (keystore) => {
//   assert(keystore && typeof keystore === 'object', 'Invalid keystore')
//   assert(keystore.encMnemonic && typeof keystore.encMnemonic === 'object', 'Keystore dose not contain mnemonic')
//   assert(keystore.crypto && typeof keystore.crypto === 'object', 'Keystore dose not contain crypto')
// }

// export const validateKeystoreForPrivateKey = (keystore) => {
//   assert(keystore && typeof keystore === 'object', 'Invalid keystore')
//   assert(keystore.crypto && typeof keystore.crypto === 'object', 'Keystore dose not contain crypto')
// }

// export const validateKeystoreForPrivateKeys = (keystore) => {
//   assert(keystore && typeof keystore === 'object', 'Invalid keystore')
//   assert(keystore.crypto && typeof keystore.crypto === 'object', 'Keystore dose not contain crypto')
//   assert(keystore.keyPathPrivates && (typeof keystore.keyPathPrivates === 'object' || typeof keystore.keyPathPrivates === 'string'), 'Keystore dose not contain keyPathPrivates')
// }

export const validateKeystoreCrypto = (crypto) => {
  assert(crypto.ciphertext && crypto.cipher && crypto.cipherparams && typeof crypto.cipherparams === 'object' && crypto.cipherparams.iv, 'Invalid keystore crypto')
}
