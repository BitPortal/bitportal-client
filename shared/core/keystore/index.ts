import assert from 'assert'
import { randomBytes, pbkdf2, scrypt, keccak256, bip39, hash160, ripemd160 } from 'core/crypto'
import { createHash, createCipheriv, createDecipheriv, createHmac } from 'crypto'
import HDKey from 'hdkey'
import secp256k1 from 'secp256k1'
import bs58 from 'bs58'
import bs58check from 'bs58check'
import uuidv4 from 'uuid/v4'
import {
  bip44Path,
  network,
  walletType,
  magicHex,
  keystoreVersion,
  derivedMode,
  chain,
  segWit,
  symbol
} from 'core/constants'
import EthereumTx from 'ethereumjs-tx'

import Chainx from 'chainx.js'

// import bech32 from 'bech32'

const decipherBuffer = (decipher: any, data: any) => {
  return Buffer.concat([decipher.update(data), decipher.final()])
}

const toChecksumAddress = async (address: string) => {
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

const generateMac = async (derivedKey: string, ciphertext: string) => {
  return (await keccak256(Buffer.concat([Buffer.from(derivedKey, 'hex').slice(16, 32), Buffer.from(ciphertext, 'hex')]))).toString('hex')
}

export const hashPassword = (password: string) => {
  const hashed1 = createHash('sha256').update(Buffer.from(password).toString('hex')).digest()
  const hashed2 = createHash('sha256').update(hashed1).digest()
  return hashed2.toString('hex')
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
    kdfparams.c = 65535 // 10240
    kdfparams.prf = 'hmac-sha256'
    derivedKey = await pbkdf2(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.c, kdfparams.dklen, 'sha256')
  } else if (kdf === 'scrypt') {
    kdfparams.n = 65535 // 8192
    kdfparams.r = 8
    kdfparams.p = 1
    derivedKey = await scrypt(Buffer.from(password).toString('hex'), kdfparams.salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
  } else {
    throw new Error('Unsupported kdf type')
  }

  const cipher = 'aes-128-ctr'
  const ciphertext = await encrypt(derivedKey, iv, origin, cipher)
  const mac = await generateMac(derivedKey, ciphertext)

  const crypto: any = {
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

export const getCachedDerivedKey = async (password: string, crypto: any) => {
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
  const mac = await generateMac(derivedKey, ciphertext)

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
  delete cryptoWithoutCachedDerivedKey.cachedDerivedKey
  return cryptoWithoutCachedDerivedKey
}

export const cacheDerivedKey = async (password: string, crypto: any) => {
  const derivedKey = await getValidDerivedKey(password, crypto)
  const cryptoWithCachedDerivedKey = { ...crypto }
  cryptoWithCachedDerivedKey.cachedDerivedKey = {
    derivedKey,
    hashedPassword: hashPassword(password)
  }
  return cryptoWithCachedDerivedKey
}

export const encrypt = async (derivedKey: string, iv: string, origin: string, cipherType: string) => {
  const derivedKeyBuffer = Buffer.from(derivedKey, 'hex')
  const ivBuffer = Buffer.from(iv, 'hex')
  const cipher = createCipheriv(cipherType, derivedKeyBuffer.slice(0, 16), ivBuffer)

  if (!cipher) {
    throw new Error('Unsupported cipher')
  }

  const ciphertext = Buffer.concat([cipher.update(Buffer.from(origin, 'hex')), cipher.final()])

  return ciphertext.toString('hex')
}

export const decrypt = async (derivedKey: string, iv: string, ciphertext: string, cipher: string) => {
  const decipher = createDecipheriv(cipher, Buffer.from(derivedKey, 'hex').slice(0, 16), Buffer.from(iv, 'hex'))

  const origin = decipherBuffer(decipher, Buffer.from(ciphertext, 'hex'))
  return origin.toString('hex')
}

export const deriveEncPair = async (password: string, origin: string, crypto: any) => {
  const derivedKey = await getCachedDerivedKey(password, crypto)
  const iv = (await randomBytes(16)).toString('hex')
  const encrypted = await encrypt(derivedKey, iv, origin, crypto.cipher)

  return {
    encStr: encrypted,
    nonce: iv
  }
}

export const decryptEncPair = async (password: string, encPair: any, crypto: any) => {
  const derivedKey = await getCachedDerivedKey(password, crypto)
  const iv = encPair.nonce
  const decrypted = await decrypt(derivedKey, iv, encPair.encStr, crypto.cipher)

  return decrypted
}

export const createIdentityKeystore = async (metadata: any, mnemonicCodes: any, password: string) => {
  const seed = bip39.mnemonicToSeedHex(mnemonicCodes.join(' '))
  const hdkey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'))
  const masterPrivateKey = hdkey.privateKey
  const masterPrivateExtendedKey = hdkey.privateExtendedKey

  const backupKey = createHmac('sha256', masterPrivateKey).update(Buffer.from('Automatic Backup Key Mainnet')).digest()
  const authenticationKey = createHmac('sha256', backupKey).update(Buffer.from('Authentication Key')).digest()

  const authKey = secp256k1.publicKeyCreate(authenticationKey)
  const pubHash = hash160(authKey)
  const networkVersion = metadata.network === network.mainnet ? '00' : '6F'
  const version = '00'
  const fullIdentifier = magicHex + networkVersion + version + pubHash.toString('hex')
  const identifier = bs58check.encode(Buffer.from(fullIdentifier, 'hex'))
  const encKeyBuffer = createHmac('sha256', backupKey).update(Buffer.from('Encryption Key')).digest()
  const encKey = encKeyBuffer.toString('hex')
  const ecKeyPub = secp256k1.publicKeyCreate(encKeyBuffer, false)

  const hashFunction = Buffer.from('12', 'hex')
  const digest = createHash('sha256').update(ecKeyPub).digest()
  const digestSize = Buffer.from(digest.byteLength.toString(16), 'hex')
  const combined = Buffer.concat([hashFunction, digestSize, digest])
  const multihash = bs58.encode(combined)
  const ipfsId = multihash.toString()

  let crypto = await createCrypto(password, Buffer.from(masterPrivateExtendedKey).toString('hex'), 'pbkdf2', true)
  const encAuthKey = await deriveEncPair(password, authenticationKey.toString('hex'), crypto)
  const encMnemonic = await deriveEncPair(password, Buffer.from(mnemonicCodes.join(' '), 'utf8').toString('hex'), crypto)
  crypto = clearCachedDerivedKey(crypto)

  const random = await randomBytes(16)
  const id = uuidv4({ random })
  const walletIDs: string[] = []

  const keystore = {
    id,
    identifier,
    encKey,
    ipfsId,
    encAuthKey,
    encMnemonic,
    crypto,
    walletIDs,
    version: keystoreVersion.identity,
    bitportalMeta: {
      ...metadata,
      timestamp: metadata.timestamp || +Date.now()
    }
  }

  return keystore
}

export const createHDBTCKeystore = async (metadata: any, mnemonicCodes: any, password: string, isSegWit: boolean, id?: string) => {
  const mnemonics = mnemonicCodes.join(' ')
  assert(bip39.validateMnemonic(mnemonics), 'Invalid mnemonics')

  const seed = bip39.mnemonicToSeedHex(mnemonics)
  const hdkey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'))

  let path

  if (metadata.network === network.mainnet) {
    path = isSegWit ? bip44Path.btcSegwitMainnet : bip44Path.btcMainnet
  } else if (metadata.network === network.testnet) {
    path = isSegWit ? bip44Path.btcSegwitTestnet : bip44Path.btcTestnet
  } else {
    throw new Error('Invalid network type')
  }

  const parentkey = hdkey.derive(path)
  const xpub = parentkey.publicExtendedKey
  const xprv = parentkey.privateExtendedKey

  const mainAddressKey = hdkey.derive(path + '/0/0')
  const mainPrivateKey = mainAddressKey.privateKey
  const mainPublicKey = secp256k1.publicKeyCreate(mainPrivateKey)
  const mainPublicKeyHash = hash160(mainPublicKey)

  let address

  if (isSegWit) {
    /* const words = bech32.toWords(mainPublicKeyHash)
     * words.unshift(0x00)
     * const redeem = bech32.encode('bc', words)*/
    const redeemHash = hash160(Buffer.from('0014' + mainPublicKeyHash.toString('hex'), 'hex'))
    address = bs58check.encode(Buffer.from('05' + redeemHash.toString('hex'), 'hex'))
  } else {
    address = bs58check.encode(Buffer.from('00' + mainPublicKeyHash.toString('hex'), 'hex'))
  }

  let crypto = await createCrypto(password, Buffer.from(xprv).toString('hex'), 'pbkdf2', true)
  const encMnemonic = await deriveEncPair(password, Buffer.from(mnemonicCodes.join(' '), 'utf8').toString('hex'), crypto)
  crypto = clearCachedDerivedKey(crypto)

  const random = await randomBytes(16)

  const keystore = {
    encMnemonic,
    crypto,
    xpub,
    address,
    version: keystoreVersion.btc,
    mnemonicPath: path,
    id: id || uuidv4({ random }),
    bitportalMeta: {
      ...metadata,
      timestamp: +Date.now(),
      walletType: walletType.hd,
      chain: chain.btc,
      segWit: isSegWit ? segWit.p2wpkh : segWit.none,
      name: 'BTC-Wallet',
      symbol: symbol.btc
    }
  }

  return keystore
}

export const createBTCKeystore = async (metadata: any, wif: any, password: string, isSegWit: boolean, id?: string) => {
  let privateKey
  const wifBuffer = bs58check.decode(wif.trim())

  const compressed = wifBuffer.length !== 33

  if (compressed) {
    assert(wifBuffer.length === 34, 'Invalid WIF length')
    assert(wifBuffer[33] === 0x01, 'Invalid compression flag')
  } else {
    assert(!isSegWit, 'SegWit requires compressed private key')
  }

  privateKey = wifBuffer.slice(1, 33)

  const publicKey = secp256k1.publicKeyCreate(privateKey, compressed)
  const publicKeyHash = hash160(publicKey)

  let address

  if (isSegWit) {
    const redeemHash = hash160(Buffer.from('0014' + publicKeyHash.toString('hex'), 'hex'))
    address = bs58check.encode(Buffer.from('05' + redeemHash.toString('hex'), 'hex'))
  } else {
    address = bs58check.encode(Buffer.from('00' + publicKeyHash.toString('hex'), 'hex'))
  }

  const crypto = await createCrypto(password, Buffer.from(wif).toString('hex'), 'pbkdf2', false)
  const random = await randomBytes(16)

  const keystore = {
    crypto,
    address,
    version: keystoreVersion.btc,
    id: id || uuidv4({ random }),
    bitportalMeta: {
      ...metadata,
      timestamp: +Date.now(),
      walletType: walletType.imported,
      chain: chain.btc,
      segWit: isSegWit ? segWit.p2wpkh : segWit.none,
      name: 'BTC-Wallet',
      symbol: symbol.btc
    }
  }

  return keystore
}

export const createHDETHKeystore = async (metadata: any, mnemonicCodes: any, password: string, mnemonicPath?: string, id?: string) => {
  const mnemonics = mnemonicCodes.join(' ')
  assert(bip39.validateMnemonic(mnemonics), 'Invalid mnemonics')

  const seed = bip39.mnemonicToSeedHex(mnemonics)
  const hdkey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'))

  if (mnemonicPath) {
    assert(mnemonicPath.indexOf(`m/44'/60'/`) !== -1, 'Invalid mnemonic path')
    const pathElements = mnemonicPath.split('/')
    assert(pathElements.length === 6 || pathElements.length === 5, 'Invalid mnemonic path elements length')
    assert(pathElements[3].slice(-1) === `'` && +pathElements[3].slice(0, -1) < 10, 'Invalid mnemonic path 3th element')
    assert(+pathElements[4] < 1000000, 'Invalid mnemonic path 4th element')
    if (pathElements.length === 6) assert(+pathElements[5] < 1000000, 'Invalid mnemonic path 5th element')
  }

  const path = mnemonicPath || bip44Path.eth

  const keyChain = hdkey.derive(path)
  const privateKey = keyChain.privateKey
  const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1)
  const a = await keccak256(publicKey)
  const lowerCaseAddress = '0x' + a.slice(-20).toString('hex')
  const address = await toChecksumAddress(lowerCaseAddress)

  let crypto = await createCrypto(password, Buffer.from(privateKey).toString('hex'), 'pbkdf2', true)
  const encMnemonic = await deriveEncPair(password, Buffer.from(mnemonicCodes.join(' '), 'utf8').toString('hex'), crypto)
  crypto = clearCachedDerivedKey(crypto)
  const random = await randomBytes(16)

  const keystore = {
    encMnemonic,
    crypto,
    address,
    version: keystoreVersion.eth,
    mnemonicPath: path,
    id: id || uuidv4({ random }),
    bitportalMeta: {
      ...metadata,
      timestamp: +Date.now(),
      walletType: walletType.hd,
      chain: chain.eth,
      name: 'ETH-Wallet',
      symbol: symbol.eth
    }
  }

  return keystore
}

export const createETHKeystore = async (metadata: any, privateKey: any, password: string, id?: string) => {
  const publicKey = secp256k1.publicKeyCreate(Buffer.from(privateKey, 'hex'), false).slice(1)
  const a = await keccak256(publicKey)
  const lowerCaseAddress = '0x' + a.slice(-20).toString('hex')
  const address = await toChecksumAddress(lowerCaseAddress)

  const crypto = await createCrypto(password, privateKey, 'pbkdf2', false)
  const random = await randomBytes(16)

  const keystore = {
    crypto,
    address,
    version: keystoreVersion.eth,
    id: id || uuidv4({ random }),
    bitportalMeta: {
      ...metadata,
      timestamp: +Date.now(),
      walletType: walletType.imported,
      chain: chain.eth,
      name: 'ETH-Wallet',
      symbol: symbol.eth
    }
  }

  return keystore
}

export const importETHKeystore = async (metadata: any, keystore: any, password: string, id?: string) => {
  assert(keystore.version === 3, 'Invalid keystore version')
  assert(keystore.crypto, 'No keystore crypto')
  const crypto = keystore.crypto
  assert(crypto.cipherparams, 'No keystore crypto cipherparams')
  assert(crypto.ciphertext, 'No keystore crypto ciphertext')
  assert(crypto.cipher, 'No keystore crypto cipher')
  const cipherparams = crypto.cipherparams
  assert(cipherparams.iv, 'No keystore crypto cipherparams iv')

  const derivedKey = await getValidDerivedKey(password, crypto)
  const iv = crypto.cipherparams.iv
  const ciphertext = crypto.ciphertext
  const cipher = crypto.cipher

  const privateKey = await decrypt(derivedKey, iv, ciphertext, cipher)
  const publicKey = secp256k1.publicKeyCreate(Buffer.from(privateKey, 'hex'), false).slice(1)
  const a = await keccak256(publicKey)
  const lowerCaseAddress = '0x' + a.slice(-20).toString('hex')
  const address = await toChecksumAddress(lowerCaseAddress)

  const bpKeystore = {
    ...keystore,
    address,
    bitportalMeta: {
      ...metadata,
      timestamp: +Date.now(),
      walletType: walletType.imported,
      chain: chain.eth,
      name: 'ETH-Wallet',
      symbol: symbol.eth
    }
  }

  return bpKeystore
}

export const createHDEOSKeystore = async (metadata: any, mnemonicCodes: any, password: string, id?: string) => {
  const mnemonics = mnemonicCodes.join(' ')
  assert(bip39.validateMnemonic(mnemonics), 'Invalid mnemonics')

  const seed = bip39.mnemonicToSeedHex(mnemonics)
  const hdkey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'))
  const path = bip44Path.eosLedger
  const masterPrivateKey = await randomBytes(16)

  let crypto = await createCrypto(password, Buffer.from(masterPrivateKey).toString('hex'), 'pbkdf2', true)
  const encMnemonic = await deriveEncPair(password, Buffer.from(mnemonicCodes.join(' '), 'utf8').toString('hex'), crypto)
  const keyPathPrivates = await Promise.all(path.split(',').map(async (hdPath: string) => {
    const keyChain = hdkey.derive(hdPath)
    const privateKey = keyChain.privateKey
    const publicKey = secp256k1.publicKeyCreate(privateKey)
    const publicKeyHash = ripemd160(publicKey)
    const address = 'EOS' + bs58.encode(Buffer.from(publicKey.toString('hex') + publicKeyHash.slice(0, 4).toString('hex'), 'hex'))
    const encPrivate = await deriveEncPair(password, privateKey.toString('hex'), crypto)
    return { encrypted: encPrivate, publicKey: address, derivedMode: derivedMode.pathDirectly, path: hdPath }
  }))
  crypto = clearCachedDerivedKey(crypto)

  const random = await randomBytes(16)

  const keystore = {
    encMnemonic,
    crypto,
    keyPathPrivates,
    address: '',
    version: keystoreVersion.eos,
    mnemonicPath: path,
    id: id || uuidv4({ random }),
    bitportalMeta: {
      ...metadata,
      timestamp: +Date.now(),
      walletType: walletType.hd,
      chain: chain.eos,
      name: 'EOS-Wallet',
      symbol: symbol.eos
    }
  }

  return keystore
}

export const createEOSKeystore = async (metadata: any, wifs: any, password: string, address?: string, id?: string) => {
  const masterPrivateKey = await randomBytes(16)
  let crypto = await createCrypto(password, Buffer.from(masterPrivateKey).toString('hex'), 'pbkdf2', true)

  const keyPathPrivates = await Promise.all(wifs.map(async (wif: string) => {
    let privateKey
    const wifBuffer = bs58check.decode(wif.trim())

    const compressed = wifBuffer.length !== 33

    if (compressed) {
      assert(wifBuffer.length === 34, 'Invalid WIF length')
      assert(wifBuffer[33] === 0x01, 'Invalid compression flag')
    }

    privateKey = wifBuffer.slice(1, 33)

    const publicKey = secp256k1.publicKeyCreate(privateKey)
    const publicKeyHash = ripemd160(publicKey)
    const address = 'EOS' + bs58.encode(Buffer.from(publicKey.toString('hex') + publicKeyHash.slice(0, 4).toString('hex'), 'hex'))
    const encPrivate = await deriveEncPair(password, privateKey.toString('hex'), crypto)
    return { encrypted: encPrivate, publicKey: address, derivedMode: derivedMode.imported }
  }))

  crypto = clearCachedDerivedKey(crypto)
  const random = await randomBytes(16)

  const keystore = {
    crypto,
    keyPathPrivates,
    address: address || '',
    version: keystoreVersion.eos,
    id: id || uuidv4({ random }),
    bitportalMeta: {
      ...metadata,
      timestamp: +Date.now(),
      walletType: walletType.imported,
      chain: chain.eos,
      name: 'EOS-Wallet',
      symbol: symbol.eos
    }
  }

  return keystore
}

export const decryptMnemonic = async (password: string, keystore: any) => {
  assert(keystore && typeof keystore === 'object', 'Invalid keystore')
  assert(keystore.encMnemonic && typeof keystore.encMnemonic === 'object', 'Keystore dose not contain mnemonic')
  assert(keystore.crypto && typeof keystore.crypto === 'object', 'Keystore dose not contain crypto')

  const encMnemonic = keystore.encMnemonic
  const crypto = keystore.crypto
  const mnemonicHex = await decryptEncPair(password, encMnemonic, crypto)
  const mnemonics = Buffer.from(mnemonicHex, 'hex').toString()
  return mnemonics
}

export const decryptPrivateKey = async (password: string, keystore: any) => {
  assert(keystore && typeof keystore === 'object', 'Invalid keystore')
  assert(keystore.crypto && typeof keystore.crypto === 'object', 'Keystore dose not contain crypto')
  const crypto = keystore.crypto

  assert(crypto.ciphertext && crypto.cipher && crypto.cipherparams && typeof crypto.cipherparams === 'object' && crypto.cipherparams.iv, 'Invalid keystore crypto')
  const derivedKey = await getValidDerivedKey(password, crypto)
  const ciphertext = crypto.ciphertext
  const cipher = crypto.cipher
  const iv = crypto.cipherparams.iv
  const privateKey = await decrypt(derivedKey, iv, ciphertext, cipher)
  return privateKey
}

export const decryptPrivateKeys = async (password: string, keystore: any) => {
  assert(keystore && typeof keystore === 'object', 'Invalid keystore')
  assert(keystore.crypto && typeof keystore.crypto === 'object', 'Keystore dose not contain crypto')
  assert(keystore.keyPathPrivates && typeof keystore.keyPathPrivates === 'object', 'Keystore dose not contain keyPathPrivates')
  const keyPathPrivates = keystore.keyPathPrivates
  let crypto = keystore.crypto

  assert(crypto.ciphertext && crypto.cipher && crypto.cipherparams && typeof crypto.cipherparams === 'object' && crypto.cipherparams.iv, 'Invalid keystore crypto')
  crypto = await cacheDerivedKey(password, crypto)
  const keyPairs = await Promise.all(keyPathPrivates.map(async (keyPathPrivate) => {
    const decrypted = await decryptEncPair(password, keyPathPrivate.encrypted, crypto)
    const publicKey = keyPathPrivate.publicKey
    const wif = bs58check.encode(Buffer.from('80' + decrypted, 'hex'))
    return { publicKey, privateKey: wif }
  }))
  clearCachedDerivedKey(crypto)
  return keyPairs
}

export const signETHTransaction = async (data: any, password: string, keystore: any) => {
  const privateKey = await decryptPrivateKey(password, keystore)
  const tx = new EthereumTx(data)
  tx.sign(Buffer.from(privateKey, 'hex'))
  const serializedTx = tx.serialize()
  return serializedTx
}

export const signBTCTransaction = async (data: any, password: string, keystore: any) => {

}

export const createHDChainxKeystore = async (metadata: any, mnemonicCodes: any, password: string, id?: string) => {
  const mnemonics = mnemonicCodes.join(' ')
  assert(bip39.validateMnemonic(mnemonics), 'Invalid mnemonics')

  const chainx = new Chainx('wss://w2.chainx.org/ws')
  chainx.account.setNet('mainnet')
  await chainx.isRpcReady()
  const keychain = chainx.account.from(mnemonics)

  const seed = keychain.privateKey()
  const path = bip44Path.chainx
  const privateKey = keychain.derive().privateKey()
  const address = keychain.derive().address()

  let crypto = await createCrypto(password, Buffer.from(privateKey).toString('hex'), 'pbkdf2', true)
  crypto = clearCachedDerivedKey(crypto)
  const encMnemonic = await deriveEncPair(password, Buffer.from(mnemonicCodes.join(' '), 'utf8').toString('hex'), crypto)
  const random = await randomBytes(16)

  const keystore = {
    crypto,
    address,
    encMnemonic,
    version: keystoreVersion.chainx,
    mnemonicPath: path,
    id: id || uuidv4({ random }),
    bitportalMeta: {
      ...metadata,
      timestamp: +Date.now(),
      walletType: walletType.hd,
      chain: chain.chainx,
      name: 'Chainx-Wallet',
      symbol: symbol.pcx
    }
  }

  return keystore
}

export const createChainxKeystore = async (metadata: any, wif: any, password: string, id?: string) => {
  const chainx = new Chainx('wss://w2.chainx.org/ws')
  chainx.account.setNet('mainnet')
  await chainx.isRpcReady()
  const keychain = chainx.account.from(wif)

  const publicKey = keychain.publicKey()
  const privateKey = keychain.privateKey()
  const address = keychain.address()

  const crypto = await createCrypto(password, Buffer.from(wif).toString('hex'), 'pbkdf2', false)
  const random = await randomBytes(16)

  const keystore = {
    crypto,
    address,
    version: keystoreVersion.chainx,
    id: id || uuidv4({ random }),
    bitportalMeta: {
      ...metadata,
      timestamp: +Date.now(),
      walletType: walletType.imported,
      chain: chain.chainx,
      name: 'Chainx-Wallet',
      symbol: symbol.pcx
    }
  }

  return keystore
}
